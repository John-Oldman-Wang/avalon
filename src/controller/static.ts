import { Controller } from '@de-pa/nast';
import { join } from 'path';
import StaticHandler from 'koa-static';

@Controller()
export default class StaticFile {
    handle: Function;
    constructor() {
        this.handle = StaticHandler(join(process.cwd(), './dist'));
    }
    use(ctx, next) {
        return this.handle(ctx, next);
    }
}
