class Game {
    constructor(room) {
        this.room = room;
    }

    get self() {
        return this.getUser(this.room.sessionId);
    }

    get name() {
        return this.self.name;
    }

    get index() {
        const selfIndex = this.self.index;
        const allIndex = this.getAllIndex();
        return allIndex.indexOf(selfIndex);
    }

    getUser(id) {
        return this.room.state.users.get(id);
    }

    getRoleName(role) {
        const metadata = JSON.parse(this.room.state.metadata);
        return metadata.roleNameMap[role];
    }

    getAllUser() {
        const users = Array.from(this.room.state.users).map(([_id, user]) => {
            return user;
        });
        return users.sort((a, b) => {
            return a.index - a.index;
        });
    }

    getTaskStatus() {
        try {
            return {
                allTask: JSON.parse(this.room.state.allTask),
                currentTask: JSON.parse(this.room.state.currentTask),
            };
        } catch (error) {
            return {};
        }
    }

    getAllIndex() {
        const users = Array.from(this.room.state.users).map(([_id, user]) => {
            return user;
        });
        const indexs = users.map(({ index }) => {
            return index;
        });

        return indexs.sort();
    }
}

export default Game;
