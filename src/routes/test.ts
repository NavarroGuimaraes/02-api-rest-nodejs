import { FastifyInstance } from 'fastify';

export const TEST_ROUTE_PREFIX = '/test';

export async function testRoutes(app: FastifyInstance) {
    app.get('/', async() => {
        return { message: 'You\'re good to go!' };
    });
}

