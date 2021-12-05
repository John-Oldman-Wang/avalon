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
    handleSubmit(tick) {
        const event = new CustomEvent('tick-submit', {
            detail: {
                tick,
            },
        });
        this.dispatchEvent(event);
    }
    render() {
        return html`<div class="root">
            <button @click="${() => this.handleSubmit(true)}">成功</button>
            <button @click="${() => this.handleSubmit(false)}">失败</button>
        </div>`;
    }
}

customElements.define('tick-pannel', TickPannel);
