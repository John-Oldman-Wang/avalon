import { LitElement, html, css } from 'https://unpkg.com/lit-element@3.0.1/index.js?module';

class UserInfoElement extends LitElement {
    static get properties() {
        return {
            isMaster: { type: Boolean },
            selfIsMaster: { type: Boolean },
            isSelf: { type: Boolean },
            id: {
                attribute: true,
            },
            name: {
                attribute: true,
            },
            role: {
                attribute: true,
            },
            see: {
                attribute: true,
            },
        };
    }
    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
                padding: 4px;
                border: 2px dashed sandybrown;
                outline-width: 5px;
            }
            :host:nth-child(odd) {
                align-items: flex-start;
            }

            :host:nth-child(even) {
                align-items: flex-end;
            }

            :host > p {
                margin: 0px;
                padding: 4px;
            }

            :host:focus-within {
                border: 2px solid sandybrown;
            }
            :host:active {
                background-color: red;
            }
        `;
    }
    render() {
        return html`<div class="user-info" tabindex="1">
            ${this.isMaster ? html`<p>司机</p>` : html``}
            <p>userId: ${this.id}</p>
            <p>名字:${this.name}</p>
            <!-- <p>role: ${this.role}</p> -->
            <!-- <p>canSeeUserIds：${this.see}</p>
            ${this.selfIsMaster ? html`<div><input type="radio" name="${this.id}" /></div>` : html``} -->
        </div>`;
    }
}

customElements.define('user-info', UserInfoElement);
