import { html, render } from 'https://unpkg.com/lit-element@3.0.1/index.js?module';
import './user-info.js';
import './member-select.js';
import './vote.js';
import './tick.js';

class Frame {
    constructor(rootEle, game) {
        this.rootEle = rootEle;
        this.game = game;
        this.listen();
    }

    listen() {
        this.rootEle.addEventListener('click', (e) => {
            this.handleClick(e);
        });
    }

    handleClick(e) {
        const btn = e.target.closest('button');
        if (!btn) {
            return;
        }
        const type = btn.getAttribute('data-type');
        this.game.room.send('action', {
            type,
        });
    }

    handleMemBerSubmit(e) {
        const selectIds = e.detail.selectIds;
        const selfID = this.game.self.id;
        this.game.room.send('action', {
            type: 'member-submit',
            data: {
                selfID,
                selectIds,
            },
        });
    }

    renderMemberSelect() {
        const users = this.game.getAllUser();

        const taskStatus = this.game.getTaskStatus();

        const currentTask = taskStatus.currentTask;
        const currentTaskMasterId = currentTask.master;

        // 自己是车长
        const selfIsMaster = this.game.self.id === currentTaskMasterId;
        // 成员还没选择
        const noMember = !currentTask.member || currentTask.member.length === 0;

        return selfIsMaster && noMember
            ? html`<member-select @member-submit="${(e) => this.handleMemBerSubmit(e)}" .users="${users}" max="${2}"></member-select>`
            : html``;
    }

    handleVoteSubmit(e) {
        const vote = e.detail.vote;
        const selfID = this.game.self.id;
        this.game.room.send('action', {
            type: 'vote-submit',
            data: {
                id: selfID,
                vote,
            },
        });
    }

    renderVote() {
        const taskStatus = this.game.getTaskStatus();

        const currentTask = taskStatus.currentTask;

        const selfId = this.game.self.id;

        if (!this.game.room.state.started) {
            return html``;
        }

        // 选定成员
        // 还没发车
        // 且票里面没自己
        if (currentTask.member.length > 0 && !currentTask.isSend && !currentTask.votes.find((item) => item.id === selfId)) {
            return html` <vote-pannel @vote-submit="${(e) => this.handleVoteSubmit(e)}"></vote-pannel>`;
        }

        return html``;
    }

    userTemplate() {
        const users = this.game.getAllUser();
        const state = this.game.room.state;
        const taskStatus = this.game.getTaskStatus();
        const currentTask = taskStatus.currentTask;
        const currentTaskMasterId = currentTask.master;

        const currentTaskMasterName = currentTaskMasterId ? this.game.getUser(currentTaskMasterId).name : '';

        const selfIsMaster = this.game.self.id === currentTaskMasterId;

        return html`<div class="root">
            <div class="buttons">
                <div>梅林练习生</div>
                <button data-type="start" .disabled="${state.started || !state.canStart}">开始游戏</button>
            </div>
            <div>当前车长：${currentTaskMasterName}</div>
            <div class="user-list">
                ${users.map((user) => {
                    const isSelf = user.id === this.game.self.id;
                    const isMaster = currentTask.id === user.id;
                    const userRoleName = this.game.getRoleName(user.role);
                    const canSeeUsers = user.canSeeUserIds
                        .map((id) => {
                            return this.game.getUser(id).name;
                        })
                        .join('|');
                    return html`<user-info
                        .isMaster=${isMaster}
                        .selfIsMaster=${selfIsMaster}
                        id="${user.id}"
                        name="${user.name}"
                        role="${userRoleName}"
                        see="${canSeeUsers}"
                        ?isSelf="${isSelf}"
                    ></user-info>`;
                })}
            </div>
            <tick-pannel></tick-pannel>
            ${this.renderMemberSelect()}${this.renderVote()}
        </div>`;
    }

    render() {
        const userHTML = this.userTemplate();
        render(userHTML, this.rootEle);
    }
}

export default Frame;
