import { LitElement, html, css } from 'https://unpkg.com/lit-element@3.0.1/index.js?module';
class MemberSelect extends LitElement {
    static get properties() {
        return {
            cansubmit: {
                type: Boolean,
            },
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
            .select {
                padding: 0px 1rem;
                display: flex;
                flex-direction: column;
            }
            .select-item {
                display: flex;
                gap: 2ch;
                align-items: baseline;
                color: var(--text-color-1);
            }

            .select-item input {
                margin: 0;
                outline-offset: 5px;
                accent-color: var(--text-color-2);
                transform-style: preserve-3d;
                cursor: pointer;
            }

            .select-item input:hover::before {
                --thumb-scale: 1;
            }
            .select-item input::before {
                --thumb-scale: 0.01;
                --thumb-highlight-size: 3rem;
                transition: transform 0.2s ease;
                content: '';
                inline-size: var(--thumb-highlight-size);
                block-size: var(--thumb-highlight-size);
                -webkit-clip-path: circle(50%);
                clip-path: circle(50%);
                position: absolute;
                inset-block-start: 50%;
                inset-inline-start: 50%;
                background: hsl(0 0% 50% / 20%);
                transform-origin: center center;
                transform: translateX(-50%) translateY(-50%) translateZ(-1px) scale(var(--thumb-scale));
                will-change: transform;
            }

            .select-item label {
                line-height: 1.5;
            }
        `;
    }
    handleSubmit(e) {
        const inputs = Array.from(this.renderRoot.querySelectorAll('input'));
        const selectIds = inputs.filter((item) => item.checked).map((item) => item.id);
        if (selectIds.length === this.max) {
            const event = new CustomEvent('member-submit', {
                detail: {
                    selectIds,
                },
            });
            this.dispatchEvent(event);
        }
    }

    getSelectIds() {
        const inputs = Array.from(this.renderRoot.querySelectorAll('input'));
        const selectIds = inputs.filter((item) => item.checked).map((item) => item.id);
        return selectIds;
    }

    handleChange() {
        const selectIds = this.getSelectIds();
        this.cansubmit = selectIds.length === this.max;
    }
    render() {
        return html`<div class="select">
            ${this.users.map((user) => {
                return html`<div class="select-item">
                    <input @change="${() => this.handleChange()}" type="checkbox" id="${user.id}" name="${user.id}" value="true" />
                    <label for="${user.id}">${user.name}</label>
                </div>`;
            })}
            <button .disabled="${!this.cansubmit}" @click="${(e) => this.handleSubmit(e)}">发布队伍</button>
        </div>`;
    }
}

customElements.define('member-select', MemberSelect);
