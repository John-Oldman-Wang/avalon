import Game from './game.js';
import Frame from './frame.js';

const rootEle = document.getElementById('root');
const urp = new URLSearchParams(location.search);

function setRoomInfo(info) {
    localStorage.setItem('room_info', JSON.stringify(info));
}

function getRoomInfo() {
    try {
        return JSON.parse(localStorage.getItem('room_info'));
    } catch (error) {
        return null;
    }
}

async function joinOrCreateRoom(client, roomName) {
    const room = await client.joinOrCreate(roomName, {
        name: urp.get('name'), //'小屁股' + ((Math.random() * 10) | 0),
    });
    setRoomInfo({
        id: room.id,
        sessionId: room.sessionId,
    });
    return room;
}

async function joinRoom(client, roomName) {
    const info = getRoomInfo();
    if (info) {
        // const roomInfos = await client.getAvailableRooms('avalon');
        // const preRoom = roomInfos.find((item) => item.roomId === info.id);
        // console.log({
        //     preRoom
        // })
        // if (!preRoom) {
        //     return joinOrCreateRoom(client, roomName);
        // }
        const room = await client.reconnect(info.id, info.sessionId).catch((err) => {
            console.log(err);
            return joinOrCreateRoom(client, roomName);
        });
        return room;
    } else {
        return joinOrCreateRoom(client, roomName);
    }
}

(async () => {
    const client = (window.client = new Colyseus.Client(`${location.protocol.replace('http', 'ws')}//${location.host}`));

    const room = (window.room = await joinRoom(client, 'avalon'));

    room.onError((code, message) => {
        console.log('oops, error ocurred:');
        console.log(message);
    });

    window.game = new Game(room);

    const f = (window.frame = new Frame(rootEle, game));

    let hasChange = false;

    room.onStateChange((state) => {
        // f.render();
        hasChange = true;
        console.log('this is the first room state!', state);
    });

    // f.render();
    requestAnimationFrame(function fn() {
        if (hasChange) {
            hasChange = false;
            f.render();
        }
        requestAnimationFrame(fn);
    });
})();
