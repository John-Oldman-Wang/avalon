import { LitElement, html, css } from 'https://unpkg.com/lit-element@3.0.1/index.js?module';
class VotePannel extends LitElement {
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

    handleSubmit(vote) {
        const event = new CustomEvent('vote-submit', {
            detail: {
                vote,
            },
        });
        this.dispatchEvent(event);
    }

    render() {
        return html`<div class="root">
            <button @click="${() => this.handleSubmit(true)}">同意</button>
            <button @click="${() => this.handleSubmit(false)}">反对</button>
        </div>`;
    }
}

customElements.define('vote-pannel', VotePannel);
