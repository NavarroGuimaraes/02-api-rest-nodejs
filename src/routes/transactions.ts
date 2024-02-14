import { FastifyInstance } from 'fastify';
import { knex } from '../database';
import { z } from 'zod';
import { checkIfSessionIdExists } from '../middlewares/check-if-session-id-exists';

export const TRANSACTION_ROUTE_PREFIX = '/transactions';

export async function transactionRoutes(app: FastifyInstance) {

    app.get('/', {
        preHandler: [checkIfSessionIdExists]
    }, async(request, reply) => {

        const { sessionId } = request.cookies;

        const transactions = await knex('transactions')
            .where('session_id', sessionId)
            .select('*');
    
        return {
            transactions
        };
    });

    app.get('/:id', {
        preHandler: [checkIfSessionIdExists]
    }, async(request, reply) => {

        const idSchema = z.object({
            id: z.string().uuid(),
        });

        const { id } = idSchema.parse(request.params);

        const { sessionId } = request.cookies;
    
        const transaction = await knex('transactions')
            .where({ id })
            .andWhere('session_id', sessionId)
            .first();
    
        if (!transaction) {
            return reply.status(404).send();
        }
    
        return transaction;
    }); 

    app.get('/summary',  {
        preHandler: [checkIfSessionIdExists]
    }, async(request, reply) => {
        const { sessionId } = request.cookies;
        const summary = await knex('transactions').where('session_id', sessionId).sum('amount', { as: 'amount' }).first();
        return { summary };
    });

    app.post('/', async(request, reply) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['income', 'outcome'])
        });

        const { title, amount, type } = createTransactionBodySchema.parse(request.body);

        let sessionId =  request.cookies.sessionId;

        if (!sessionId) {
            sessionId = crypto.randomUUID();
            reply.setCookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                // httpOnly: true,
                // secure: true,
                // sameSite: 'none',
            });
        
        } 

        await knex('transactions').insert({
            id: crypto.randomUUID(),
            title,
            amount: type === 'income' ? amount : amount * -1,
            // eslint-disable-next-line camelcase
            session_id: sessionId,
        });

        return reply.status(201).send();
    });

}