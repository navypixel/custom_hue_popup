import './hue-controls.js';
import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.2/index.js?module';
import { customElement, property } from 'https://unpkg.com/lit/decorators.js?module';

@customElement('custom-hue-popup')
class CustomHuePopup extends LitElement {
  @property({ type: Object }) hass;
  @property({ type: Array }) entities = [];
  @property({ type: Boolean }) opened = false;

  stateUnsubs = [];

  static styles = css`
    .custom-hue-popup-backdrop {
      position: fixed;
      top:0; left:0; right:0; bottom:0;
      background: rgba(0,0,0,0.5);
      display:flex;
      justify-content:center;
      align-items:center;
      z-index:9999;
    }
    .custom-hue-popup-card {
      background: var(--card-background-color, white);
      border-radius: 12px;
      padding:16px;
      min-width:280px;
      max-width:500px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    .custom-hue-popup-card h3 {
      margin:0 0 8px 0;
      font-size:1.1em;
    }
  `;

  render() {
    if (!this.opened) return html``;

    return html`
      <div class="custom-hue-popup-backdrop" @click=${()=>this.close()}>
        <div class="custom-hue-popup-card" @click=${e=>e.stopPropagation()}>
          ${this.entities.map(entity=>html`
            <h3>${entity.attributes.friendly_name}</h3>
            <hue-light-controls .hass=${this.hass} .entity=${entity}></hue-light-controls>
          `)}
        </div>
      </div>
    `;
  }

  open(hass, entity_ids) {
    this.hass = hass;
    this.entities = entity_ids.map(id=>hass.states[id]).filter(Boolean);
    this.opened = true;

    this.unsubscribeAll();
    this.entities.forEach(entity => {
      const unsub = hass.connection.subscribeEvents(e=>{
        const newState = hass.states[entity.entity_id];
        if(newState){
          entity.state=newState.state;
          entity.attributes=newState.attributes;
          this.requestUpdate();
        }
      }, 'state_changed');
      this.stateUnsubs.push(unsub);
    });
  }

  close() {
    this.opened=false;
    this.unsubscribeAll();
  }

  unsubscribeAll() {
    this.stateUnsubs.forEach(unsub=>unsub());
    this.stateUnsubs=[];
  }
}

// Create popup element
const popup = document.createElement('custom-hue-popup');
document.body.appendChild(popup);

// Listen for fire-dom-event
document.addEventListener('custom_hue_popup', e=>{
  const entity_ids = e.detail.entity_id || [];
  const ha = document.querySelector('home-assistant');
  if(!ha || !ha.hass) return;
  popup.open(ha.hass, Array.isArray(entity_ids)?entity_ids:[entity_ids]);
});

// Listen for "hue-screen" style hold_action
document.addEventListener('hue-screen', e=>{
  const entity_ids = e.detail.entity_id || [];
  const ha = document.querySelector('home-assistant');
  if(!ha || !ha.hass) return;
  popup.open(ha.hass, Array.isArray(entity_ids)?entity_ids:[entity_ids]);
});
