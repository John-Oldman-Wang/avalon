import { Context, Controller } from '@de-pa/nast';

@Controller('/api')
export default class Index {
    use(ctx: Context) {
        ctx.body = 'it is avalon';
    }
}
