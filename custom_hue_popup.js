import './hue-controls.js';
import { LitElement, html } from 'https://unpkg.com/lit@2.7.2/index.js?module';
import { customElement, property } from 'https://unpkg.com/lit/decorators.js?module';

@customElement('custom-hue-popup')
class CustomHuePopup extends LitElement {
  @property({type: Object}) hass;
  @property({type: Object}) entities = [];
  @property({type: Boolean}) opened = false;

  stateUnsubs = [];

  render() {
    if (!this.opened) return html``;
    return html`
      <div class="custom-hue-popup-backdrop" @click=${() => this.close()}>
        <div class="custom-hue-popup-card" @click=${e => e.stopPropagation()}>
          ${this.entities.map(entity => html`
            <h3>${entity.attributes.friendly_name}</h3>
            <hue-light-controls .hass=${this.hass} .entity=${entity}></hue-light-controls>
          `)}
        </div>
      </div>
    `;
  }

  open(hass, entity_ids) {
    this.hass = hass;
    this.entities = entity_ids.map(id => hass.states[id]).filter(Boolean);
    this.opened = true;

    this.unsubscribeAll();
    this.entities.forEach(entity => {
      const unsub = hass.connection.subscribeEvents(e => {
        const newState = hass.states[entity.entity_id];
        if(newState) {
          entity.state = newState.state;
          entity.attributes = newState.attributes;
          this.requestUpdate();
        }
      }, 'state_changed');
      this.stateUnsubs.push(unsub);
    });
  }

  close() {
    this.opened = false;
    this.unsubscribeAll();
  }

  unsubscribeAll() {
    this.stateUnsubs.forEach(unsub => unsub());
    this.stateUnsubs = [];
  }
}

// Wait for HA frontend to load
window.addEventListener('DOMContentLoaded', () => {
  const popup = document.createElement('custom-hue-popup');
  document.body.appendChild(popup);

  const ha = document.querySelector('home-assistant');
  if (!ha) return;

  const hass = ha.hass;

  // Register as a real HA frontend service
  hass.callService = hass.callService || (() => {});

  hass.services.register('custom_hue_popup', 'open', (call) => {
    let ids = Array.isArray(call.data.entity_id) ? call.data.entity_id : [call.data.entity_id];
    popup.open(hass, ids);
  });
});
