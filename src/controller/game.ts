import { Context, Controller } from '@de-pa/nast';
import { Inject } from 'injection-js';
import GameServer from '../service/server';

@Controller('/matchmake')
export default class Game {
    constructor(@Inject('colyseus') public server: GameServer) {}
    use(ctx: Context) {
        // 设置 ctx.respond 位false 让 koa 不处理请求, 让 colyseus 处理请求
        ctx.respond = false;
    }
}
