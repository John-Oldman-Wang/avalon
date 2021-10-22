// 角色数据 和 分配规则
enum Roles {
    Loyal_Servant, // 忠诚
    Merlin, // 梅林
    Percival, // 派西维尔

    Morgana, // 莫甘娜
    Assassin, // 刺客

    Oberon, // 奥伯伦
    Mordred, // 莫德雷德
    Minion, // 爪牙
}

const roleNameMap = {
    [Roles.Loyal_Servant]: '忠臣',
    [Roles.Merlin]: '梅林',
    [Roles.Percival]: '派西维尔',
    [Roles.Morgana]: '莫甘娜',
    [Roles.Assassin]: '刺客',
    [Roles.Oberon]: '奥伯伦',
    [Roles.Minion]: '莫德雷德的爪牙',
    [Roles.Mordred]: '莫德雷德',
};

const userCountRoleMap = {
    5: [Roles.Loyal_Servant, Roles.Merlin, Roles.Percival, Roles.Assassin, Roles.Morgana],
    6: [Roles.Loyal_Servant, Roles.Loyal_Servant, Roles.Merlin, Roles.Percival, Roles.Assassin, Roles.Morgana],
    7: [Roles.Loyal_Servant, Roles.Loyal_Servant, Roles.Merlin, Roles.Percival, Roles.Assassin, Roles.Morgana, Roles.Oberon],
    8: [
        Roles.Loyal_Servant,
        Roles.Loyal_Servant,
        Roles.Loyal_Servant,
        Roles.Merlin,
        Roles.Percival,
        Roles.Assassin,
        Roles.Morgana,
        Roles.Minion,
    ],
    9: [
        Roles.Loyal_Servant,
        Roles.Loyal_Servant,
        Roles.Loyal_Servant,
        Roles.Loyal_Servant,
        Roles.Merlin,
        Roles.Percival,
        Roles.Assassin,
        Roles.Morgana,
        Roles.Mordred,
    ],
    10: [
        Roles.Loyal_Servant,
        Roles.Loyal_Servant,
        Roles.Loyal_Servant,
        Roles.Loyal_Servant,
        Roles.Merlin,
        Roles.Percival,
        Roles.Assassin,
        Roles.Morgana,
        Roles.Mordred,
        Roles.Oberon,
    ],
};

const canSeeMap: {
    [key: string]: Roles[];
} = {
    [Roles.Loyal_Servant]: [],
    [Roles.Merlin]: [Roles.Morgana, Roles.Assassin, Roles.Oberon, Roles.Minion],
    [Roles.Percival]: [Roles.Merlin, Roles.Morgana],
    [Roles.Morgana]: [Roles.Assassin, Roles.Minion],
    [Roles.Assassin]: [Roles.Morgana, Roles.Minion],
    [Roles.Oberon]: [],
    [Roles.Minion]: [Roles.Morgana],
    [Roles.Mordred]: [Roles.Morgana, Roles.Assassin, Roles.Minion],
};

export default class RoleManager<T> {
    metaData = {
        roles: Roles,
        roleNameMap,
        canSeeMap,
    };
    getRole(count: number) {
        return [...userCountRoleMap[count]];
    }
    canSeeRoles(selfRole: Roles, otherRoles: Array<T & { role: Roles }>): T[] {
        const canSeeRoles = canSeeMap[selfRole];
        return otherRoles.filter((item) => {
            if (!canSeeRoles) {
                console.log({
                    selfRole,
                    canSeeRoles,
                });
            }
            return canSeeRoles.includes(item.role);
        });
    }
}
