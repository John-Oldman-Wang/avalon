import { Room } from '@colyseus/core';
import { Schema, MapSchema, ArraySchema, type } from '@colyseus/schema';
import RoleManager from './role';
import TaskManage from './task';

class User extends Schema {
    @type('boolean')
    connected = true;

    @type('string')
    id: string;

    @type('string')
    name: string;

    @type('number')
    role: number = -1;

    @type('number')
    index: number = 0;

    @type(['string'])
    canSeeUserIds: ArraySchema<string> = new ArraySchema<string>();
}

class GameState extends Schema {
    @type('boolean') canStart: boolean = false;
    @type('boolean') started: boolean = false;

    @type({ map: User })
    users: MapSchema<User> = new MapSchema();

    @type('string')
    allTask: string = JSON.stringify([]);

    @type('string')
    currentTask: string = JSON.stringify({});

    @type('string')
    metadata: string = '{}';
}

export default class AvalongRoom extends Room<GameState> {
    taskM: TaskManage<User>;

    roleM: RoleManager<User>;

    maxClients = 10;

    minUserCount = 5;
    maxUserCount = 10;

    index = 0;

    started = false;

    updateState() {
        const result = this.state.users.size >= this.minUserCount && this.state.users.size <= this.maxUserCount;
        this.state.canStart = result;
        return result;
    }

    async start() {
        if (this.state.started) {
            return;
        }
        this.state.started = true;
        if (this.locked) {
            return;
        }
        await this.lock();
        this.gameStart();
    }

    gameStart() {
        // 分配角色
        this.assignRoles();
        this.taskM = new TaskManage([...this.state.users.values()]);
        this.updateTaskStatus();
    }

    updateTaskStatus() {
        const taskStatus = this.taskM.getStauts();
        this.state.allTask = JSON.stringify(taskStatus.allTask);
        this.state.currentTask = JSON.stringify(taskStatus.currentTask);
        if (this.taskM.isEnd()) {
            this.broadcast('game-end');
        }
    }

    assignRoles() {
        // 分配角色
        const allUser = [...this.state.users.values()];
        const roles = this.roleM.getRole(allUser.length);
        roles.sort(() => {
            return Math.random() * 2 > 1 ? 1 : -1;
        });

        allUser.forEach((user) => {
            user.role = roles.shift();
        });

        allUser.forEach((user) => {
            const otherUsers = allUser.filter((item) => item !== user);
            const canSeeUsers = this.roleM.canSeeRoles(user.role, otherUsers);
            const canSeeUserIds = canSeeUsers.map((i) => i.id);
            user.canSeeUserIds.length = 0;
            user.canSeeUserIds.push(...canSeeUserIds);
        });
    }

    end() {
        this.state.users.forEach((user) => {
            user.role = -1;
        });
    }

    addUser(user: User) {
        this.state.users.set(user.id, user);
    }

    delUser(id) {
        return this.state.users.delete(id);
    }

    onCreate() {
        this.setState(new GameState());
        this.roleM = new RoleManager<User>();
        this.state.metadata = JSON.stringify(this.roleM.metaData);
        this.setMetadata(this.roleM.metaData);
        this.onMessage('action', (client, message) => {
            this.handleMessage('action', client, message);
        });
    }

    handleMessage(type, client, message) {
        console.log({
            id: client.id,
            type,
            message,
        });
        if (message.type === 'start') {
            this.start();
        }
        if (message.type === 'member-submit') {
            const { selfID, selectIds } = message.data;
            const result = this.taskM.setMember(selfID, selectIds);
            if (result) {
                this.updateTaskStatus();
            }
        }
        if (message.type === 'vote-submit') {
            const { id, vote } = message.data;
            const result = this.taskM.setVote(id, vote);
            if (result) {
                this.updateTaskStatus();
            }
        }
        if (message.type === 'tick-submit') {
            const { id, tick } = message.data;
            const result = this.taskM.setTick(id, tick);
            if (result) {
                this.updateTaskStatus();
            }
        }
    }

    onAuth(client, option) {
        if (this.started) {
            return false;
        }
        return {
            id: client.sessionId,
            name: option.name,
        };
    }
    onJoin(client, option, userOtion) {
        const user = new User();
        Object.assign(user, userOtion);

        user.index = this.index++;

        this.addUser(user);

        this.updateState();
    }
    async onLeave(client, consented: boolean) {
        // 房间没有锁 也就是游戏没又开始 直接删除退出人
        if (!this.locked) {
            this.delUser(client.sessionId);
            return;
        }

        this.state.users.get(client.sessionId).connected = false;
        try {
            if (consented) {
                throw new Error('consented leave');
            }

            // allow disconnected client to reconnect into this room until 20 seconds
            await this.allowReconnection(client, 5 * 60 * 60);

            // client returned! let's re-activate it.
            this.state.users.get(client.sessionId).connected = true;
        } catch (e) {
            // 20 seconds expired. let's remove the client.
            // this.delUser(client.sessionId);
        }
    }
    onDispose() {
        console.log('onDispose', arguments);
    }
}
