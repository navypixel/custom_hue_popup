import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.2/index.js?module';
import { customElement, property } from 'https://unpkg.com/lit/decorators.js?module';
import './hue-scenes.js';

@customElement('hue-light-controls')
class HueLightControls extends LitElement {
  @property({type: Object}) hass;
  @property({type: Object}) entity;

  static styles = css`
    .control-group { display: flex; flex-direction: column; gap: 12px; }
    .slider { width: 100%; }
    button { padding: 8px 12px; border-radius: 8px; cursor: pointer; }
  `;

  toggleLight() {
    this.hass.callService('light', this.entity.state === 'on' ? 'turn_off' : 'turn_on', { entity_id: this.entity.entity_id });
  }

  setBrightness(e) {
    this.hass.callService('light', 'turn_on', { entity_id: this.entity.entity_id, brightness_pct: e.target.value });
  }

  setColor(e) {
    const color = e.target.value; 
    this.hass.callService('light', 'turn_on', { entity_id: this.entity.entity_id, rgb_color: this.hexToRgb(color) });
  }

  setColorTemp(e) {
    this.hass.callService('light', 'turn_on', { entity_id: this.entity.entity_id, color_temp: e.target.value });
  }

  hexToRgb(hex) {
    let r = parseInt(hex.substr(1,2),16);
    let g = parseInt(hex.substr(3,2),16);
    let b = parseInt(hex.substr(5,2),16);
    return [r,g,b];
  }

  render() {
    return html`
      <div class="control-group">
        <button @click=${this.toggleLight}>${this.entity.state === 'on' ? 'Turn Off' : 'Turn On'}</button>

        <label>Brightness</label>
        <input class="slider" type="range" min="0" max="100" value=${this.entity.attributes.brightness_pct || 50} @input=${this.setBrightness}>

        <label>Color</label>
        <input type="color" @input=${this.setColor}>

        ${this.entity.attributes.color_temp ? html`
          <label>Color Temp</label>
          <input class="slider" type="range" min="153" max="500" value=${this.entity.attributes.color_temp} @input=${this.setColorTemp}>
        ` : ''}

        <hue-scene-buttons .hass=${this.hass} .entity=${this.entity}></hue-scene-buttons>
      </div>
    `;
  }
}
