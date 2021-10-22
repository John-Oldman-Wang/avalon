// vite.config.js
import path from 'path';

export default ({ mode }) => {
    const isDev = mode === 'development';
    return {
        // config options
        base: './',
        mode: mode,
        root: './page',
        build: {
            outDir: isDev ? path.resolve(process.cwd(), './dist') : path.resolve(process.cwd(), './app/dist'),
        },
    };
};
