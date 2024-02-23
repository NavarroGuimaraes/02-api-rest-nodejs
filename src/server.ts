import { app } from './app';
import { env } from './env';

app
    .listen({
        port: env.PORT,
        host: ('RENDER' in process.env) ? '0.0.0.0' : 'localhost',
    })
    .then((address) => {
        console.log(`server listening on ${address}`);
    })
    .catch((err) => {
        console.error(err);
    });
