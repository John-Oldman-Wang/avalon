import 'reflect-metadata';
import { Server } from 'http';
import { Module, create } from '@de-pa/nast';
import { Injector } from 'injection-js';
import { WebSocketTransport } from '@colyseus/ws-transport';

import Index from './controller/index';
import StaticFile from './controller/static';
import Game from './controller/game';
import GameServer from './service/server';
import AvalongRoom from './game/room';

@Module({
    controllers: [StaticFile, Game, Index],
    providers: [
        {
            provide: 'colyseus',
            useClass: GameServer,
        },
        {
            provide: WebSocketTransport,
            useFactory: (server) => {
                return new WebSocketTransport({
                    server,
                });
            },
            deps: [Server],
        },
    ],
})
class AppModule {
    constructor(public inject: Injector) {}

    init() {
        const s: GameServer = this.inject.get('colyseus');
        this.initGameServer(s);
    }

    initGameServer(server) {
        server.define('avalon', AvalongRoom);
    }
}

const app = create(AppModule);

const port = 9999;

app.listen(port, () => {
    console.log(`server start at http://localhost:${port}/`);
});
