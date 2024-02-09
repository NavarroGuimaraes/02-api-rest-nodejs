import { FastifyInstance } from 'fastify';
import { knex } from '../database';
import { z } from 'zod';

export async function transactionRoutes(app: FastifyInstance) {
    app.get('/', async() => {
        const transactions = await knex('transactions').select('*');
    
        return {
            transactions
        };
    });

    app.get('/:id', async(request, reply) => {

        const idSchema = z.object({
            id: z.string().uuid(),
        });

        const { id } = idSchema.parse(request.params);
    
        const transaction = await knex('transactions').where({ id }).first();
    
        if (!transaction) {
            return reply.status(404).send();
        }
    
        return transaction;
    }); 

    app.post('/', async(request, reply) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['income', 'outcome'])
        });

        const { title, amount, type } = createTransactionBodySchema.parse(request.body);

        await knex('transactions').insert({
            id: crypto.randomUUID(),
            title,
            amount: type === 'income' ? amount : amount * -1,
        });

        return reply.status(201).send();
    });

}