import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.2/index.js?module';
import { customElement, property } from 'https://unpkg.com/lit/decorators.js?module';

@customElement('hue-light-controls')
export class HueLightControls extends LitElement {
  @property({ type: Object }) hass;
  @property({ type: Object }) entity;

  static styles = css`
    .control { margin: 4px 0; }
    button { padding: 4px 8px; margin-right: 4px; }
  `;

  render() {
    if(!this.entity) return html``;
    return html`
      <div class="control">
        <button @click=${()=>this.toggle()}>Toggle</button>
        <span>State: ${this.entity.state}</span>
      </div>
    `;
  }

  toggle() {
    this.hass.callService('light', 'toggle', { entity_id: this.entity.entity_id });
  }
}
