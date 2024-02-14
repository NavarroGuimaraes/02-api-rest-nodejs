import { app } from './app';
import { env } from './env';

app
    .listen({
        port: env.PORT,
    })
    .then((address) => {
        console.log(`server listening on ${address}`);
    })
    .catch((err) => {
        console.error(err);
    });
