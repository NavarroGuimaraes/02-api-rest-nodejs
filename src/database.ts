import 'dotenv/config';
import { knex as setupKnex, Knex } from 'knex';

export const dbConfig: Knex.Config = {
    client:'sqlite3',
    connection: {
        filename: process.env.DATABASE_URL ?? './database.sqlite',
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './domain/migrations',
    },
};

export const knex = setupKnex(dbConfig);
