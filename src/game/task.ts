const taskRoleCount = {
    5: [2, 3, 2, 3, 3],
    6: [2, 3, 4, 3, 4],
    7: [2, 3, 3, 4, 4],
    8: [3, 4, 4, 5, 5],
    9: [3, 4, 4, 5, 5],
    10: [3, 4, 4, 5, 5],
};

interface UserBase {
    id: any;
}

interface Task<T> {
    // 这次任务人数
    count: number;
    master: T;
    // 任务表决
    votes: Array<
        UserBase & {
            vote: boolean;
        }
    >;
    // 是否启动任务
    isSend: boolean;
    // 任务成员
    member: T[];
    // 任务投票
    ticks: boolean[];
    // 任务结果
    result: boolean;
}

// 任务开始
// 只能确定 master
// 选择成员 // 一次提交多个成员
// 收集投票 // 逐一收集 vote 需要展示具体
// 确定投票结果 // 内部判断
// 任务可以进行 任务不进行 // 结果
// 任务进行 // 收集 tick
// 确定最终结果任务结果 result 已经更新 isSend

export default class TaskManage<User extends UserBase> {
    allTask: Task<User>[] = [];
    currentTask: Task<User>;
    taskCount: number[];

    constructor(public roles: User[]) {
        this.init();
        this.next();
    }

    getStauts() {
        const allTask = this.allTask.map(({ master, ...rest }) => {
            return {
                master: master.id,
                ...rest,
            };
        });

        const { master, ...rest } = this.currentTask;

        const currentTask = {
            master: master.id,
            ...rest,
        };

        return {
            allTask,
            currentTask,
        };
    }

    init() {
        this.taskCount = taskRoleCount[this.roleCount];
    }

    isEnd() {
        return this.sendTaskCount === 5;
    }

    setMember(selfId: string, selectIds: string[]) {
        if (selfId !== this.currentTask.master.id) {
            return false;
        }
        if ([...new Set(selectIds)].length !== this.currentTask.count) {
            return false;
        }

        const member = selectIds
            .map((id) => {
                return this.roles.find((role) => role.id === id);
            })
            .filter(Boolean);

        if (member.length !== this.currentTask.count) {
            return false;
        }

        this.currentTask.member = member;

        return true;
    }

    setVote(id: string, vote: boolean) {
        const hasVote = this.currentTask.votes.find((item) => {
            return item.id === id;
        });
        if (this.currentTask.member.length === 0) {
            return false;
        }
        if (!!hasVote) {
            return false;
        }
        this.currentTask.votes.push({
            id,
            vote,
        });
        if (this.currentTask.votes.length === this.roles.length) {
            // todo 判断是否发车
            const canSend = this.currentTask.votes.filter((item) => item.vote).length > this.roles.length / 2;
            if (canSend) {
                this.currentTask.isSend = true;
            } else {
                // this.currentTask.
            }
        }
        return true;
    }

    getNextMaster() {
        // 倒数2个master
        const lastestMasters = this.allTaskMaster.slice(-2);
        const notLastestMasters = this.roles.filter((item) => !lastestMasters.includes(item));
        const random = Math.floor(Math.random() * notLastestMasters.length);
        return notLastestMasters[random];
    }

    // 设置 任务
    nextTask() {
        const master = this.getNextMaster();
        const count = this.taskCount[this.sendTaskCount];
        const task: Task<User> = {
            count,
            master,
            member: [],
            votes: [],
            ticks: [],
            isSend: false,
            result: false,
        };
        this.currentTask = task;
        this.allTask.push(this.currentTask);
    }

    next() {
        if (!this.isEnd()) {
            this.nextTask();
        }

        return this;
    }

    isProtected() {
        // 人数大于等于 7 人 且 已经做了3轮任务
        return this.roleCount >= 7 && this.sendTaskCount === 3;
    }

    // todo return boolean
    isTaskSuccess(task: Task<User>): boolean {
        if (!task.isSend) {
            return false;
        }
        const failTicks = task.ticks.filter((item) => item === false);
        const isProtected = this.isProtected();

        // 保护局大于1张 就是2张 非保护局 大于0 就是1张
        return failTicks.length > (isProtected ? 1 : 0) ? false : true;
    }

    get roleCount() {
        return this.roles.length;
    }

    get sendTaskCount() {
        return this.allTask.filter((item) => item.isSend).length;
    }

    get successTaskCount() {
        return this.allTask.filter((item) => item.result).length;
    }

    get allTaskMaster() {
        return this.allTask.map((item) => item.master);
    }
}
