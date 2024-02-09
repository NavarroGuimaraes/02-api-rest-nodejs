import fastify from 'fastify';
import { knex } from './database';
import crypto from 'node:crypto';
import { env } from './env';
import { transactionRoutes } from './routes/transactions';

const app = fastify();

app.get('/test', async(request, reply) => {
    const transaction = await knex('transactions').insert({
        id: crypto.randomUUID(),
        title: 'test-2',
        amount: 4242})
        .returning('*');

    return transaction;
});

app.register(transactionRoutes, {
    prefix: '/transactions',
});

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
