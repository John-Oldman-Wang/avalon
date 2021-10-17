import { Room } from '@colyseus/core';
import { Schema, MapSchema, ArraySchema, type } from '@colyseus/schema';
import RoleManager from './role';

class User extends Schema {
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

    @type({ map: User })
    users: MapSchema<User> = new MapSchema();
}

export default class AvalongRoom extends Room<GameState> {
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
        if (this.started) {
            return;
        }
        this.started = false;
        if (this.locked) {
            return;
        }
        await this.lock();
        this.assignRoles();
    }

    assignRoles() {
        // 分配角色
        const roles = this.roleM.getRole(this.state.users.size);
        const allUser = [...this.state.users.values()];
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

    setRole() {}

    addUser(user: User) {
        this.state.users.set(user.id, user);
    }

    delUser(id) {
        return this.state.users.delete(id);
    }

    onCreate() {
        this.setState(new GameState());
        this.roleM = new RoleManager<User>();
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

        this.broadcast('join', user);

        this.updateState();
    }
    onLeave(client) {
        this.delUser(client.sessionId);
    }
    onDispose() {
        console.log('onDispose', arguments);
    }
}
