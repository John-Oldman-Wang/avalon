import 'reflect-metadata';

import { Module, create } from '@de-pa/nast';

import Index from './controller/index';

@Module({
    controllers: [Index],
})
class AppModule {}

const app = create(AppModule);

const port = 9999;

app.listen(port, () => {
    console.log(`server start at http://localhost:${port}/`);
});
