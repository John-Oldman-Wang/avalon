import { Controller } from '@de-pa/nast';

@Controller()
export default class Index {
    use(ctx) {
        ctx.body = 'it is avalon';
    }
}
