import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.2/index.js?module';
import { customElement, property } from 'https://unpkg.com/lit/decorators.js?module';

@customElement('hue-scene-buttons')
class HueSceneButtons extends LitElement {
  @property({type: Object}) hass;
  @property({type: Object}) entity;

  static styles = css`
    .scenes { display:flex; gap:8px; flex-wrap: wrap; }
    button { padding:6px 10px; border-radius:8px; cursor:pointer; }
  `;

  activateScene(scene) {
    this.hass.callService('light', 'turn_on', { entity_id: this.entity.entity_id, effect: scene });
  }

  render() {
    const scenes = ['Rainbow', 'Sunset', 'Nightlight']; // customize
    return html`
      <div class="scenes">
        ${scenes.map(scene => html`
          <button @click=${() => this.activateScene(scene)}>${scene}</button>
        `)}
      </div>
    `;
  }
}
