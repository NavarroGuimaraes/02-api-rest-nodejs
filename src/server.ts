import fastify from 'fastify';
import { knex } from './database';
import crypto from 'node:crypto';

const app = fastify();

app.get('/test', async(request, reply) => {
    const transaction = await knex('transactions').insert({
        id: crypto.randomUUID(),
        title: 'test-2',
        amount: 4242})
        .returning('*');

    return transaction;
});

app.get('/findAllTransactions', async(request, reply) => {
    const transactions = await knex('transactions').select('*');

    return transactions;
});
app
    .listen({
        port: 3333,
    })
    .then((address) => {
        console.log(`server listening on ${address}`);
    })
    .catch((err) => {
        console.error(err);
    });
