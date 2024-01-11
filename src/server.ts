import fastify from 'fastify';
import { knex } from './database';

const app = fastify();

app.get('/tables', async(request, reply) => {
    const tables = await knex('sqlite_schema').select('*');

    return tables;
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
