import fastify from 'fastify';
import { TRANSACTION_ROUTE_PREFIX, transactionRoutes } from './routes/transactions';
import { TEST_ROUTE_PREFIX, testRoutes } from './routes/test';
import cookie from '@fastify/cookie';

export const app = fastify();

// É importante que os cookies estejam antes do registro as rotas!!
// É nessa ordem que o fastify irá criar as rotas

app.register(cookie);

app.addHook('preHandler', async(request) => {
    console.log(`[${request.method}] ${request.url}`);
});

app.register(testRoutes, {
    prefix: TEST_ROUTE_PREFIX,

});
app.register(transactionRoutes, {
    prefix: TRANSACTION_ROUTE_PREFIX,
});
