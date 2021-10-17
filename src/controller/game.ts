import { Context, Controller } from '@de-pa/nast';
import { Inject } from 'injection-js';
import GameServer from '../game/server';

@Controller('/matchmake')
export default class Game {
    constructor(@Inject('colyseus') public server: GameServer) {}
    async use(ctx: Context) {
        await this.server.handleMatch(ctx.req, ctx.res);
    }
}
