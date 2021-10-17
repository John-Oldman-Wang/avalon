import { Server } from 'colyseus';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { Injectable } from 'injection-js';

@Injectable()
export default class GameServer extends Server {
    constructor(webSocketTransport: WebSocketTransport) {
        super({
            transport: webSocketTransport,
        });
    }
    attachMatchMakingRoutes() {}
    handleMatch(req, res) {
        super.handleMatchMakeRequest(req, res);
        return new Promise((resolve) => {
            res.on('end', resolve);
        });
    }
}
