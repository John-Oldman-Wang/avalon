import { LitElement, html, css } from 'https://unpkg.com/lit-element@3.0.1/index.js?module';
class TickPannel extends LitElement {
    static get properties() {
        return {
            users: {
                type: Array,
            },
            max: {
                attribute: true,
                type: Number,
            },
        };
    }

    static get styles() {
        return css`
            .root {
                display: flex;
                justify-content: space-around;
            }
        `;
    }
    render() {
        return html`<div class="root">
            <button>成功</button>
            <button>失败</button>
        </div>`;
    }
}

customElements.define('tick-pannel', TickPannel);
