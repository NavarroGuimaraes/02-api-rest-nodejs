import { knex as setupKnex, Knex } from 'knex';
import { env } from './env';

export const dbConfig: Knex.Config = {
    client:'sqlite3',
    connection: {
        filename: env.DATABASE_URL,
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './domain/migrations',
    },
};

export const knex = setupKnex(dbConfig);
