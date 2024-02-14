import { expect, test, beforeAll, afterAll, describe, beforeEach } from 'vitest';
import { app } from '../src/app';
import supertest from 'supertest';
import { execSync } from 'child_process';

describe('Transactions', () => {

    beforeEach(async() => {
        // Antes de todos os testes, nós apagamos as tabelas e criamos novamente
        // Poderíamos fazer isso apenas uma vez, mas para garantir que os testes
        // sejam independentes, fazemos isso a cada vez que rodamos os testes
        await execSync('npm run knex migrate:rollback --all');
        await execSync('npm run knex migrate:latest');
    });

    beforeAll(async() => {
        await app.ready();
    });
    
    // Importante: após os testes, é importante fechar a aplicação
    afterAll(async() => {
        await app.close();
    });
    
    test('User should be able to create a new transaction', async() => {
    
        const response = await supertest(app.server)
            .post('/transactions')
            .send({
                title: 'Test transaction',
                amount: 100,
                type: 'income'
            });
    
        expect(response.status).toBe(201);
    });

    test('User should be able to get a list of transactions', async() => {

        const transactionToBeCreated = {
            title: 'Listing transaction test',
            amount: 100,
            type: 'income'
        };

        const creationResponse = await supertest(app.server)
            .post('/transactions')
            .send(transactionToBeCreated);

        const cookie = creationResponse.get('Set-Cookie');
    
        const listTransactionResponse = await supertest(app.server)
            .get('/transactions')
            .set('Cookie', cookie);
    
        expect(listTransactionResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: transactionToBeCreated.title,
                amount: transactionToBeCreated.amount
            })
        ]);
    });

    test('User should be able to get a transaction by id', async() => {

        const transactionToBeCreated = {
            title: 'Get by id transaction test',
            amount: 100,
            type: 'income'
        };

        const creationResponse = await supertest(app.server)
            .post('/transactions')
            .send(transactionToBeCreated);

        const cookie = creationResponse.get('Set-Cookie');

        const getTransactionListResponse = await supertest(app.server)
            .get('/transactions')
            .set('Cookie', cookie);

        const transactionId = getTransactionListResponse.body.transactions[0].id;
        
        const getTransactionResponse = await supertest(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookie);

        expect(getTransactionResponse.body).toEqual(
            expect.objectContaining({
                title: transactionToBeCreated.title,
                amount: transactionToBeCreated.amount
            })
        );
    });

    test('User should be able to get a summary of transactions', async() => {
            
        const incomeTransactionToBeCreated = {
            title: 'INCOME!',
            amount: 150,
            type: 'income'
        };

        const outcomeTransactionToBeCreated = {
            title: 'OUTCOME!',
            amount: 100,
            type: 'outcome'
        };
    
        const creationResponse = await supertest(app.server)
            .post('/transactions')
            .send(incomeTransactionToBeCreated);
    
        const cookie = creationResponse.get('Set-Cookie');

        await supertest(app.server)
            .post('/transactions')
            .send(outcomeTransactionToBeCreated)
            .set('Cookie', cookie);

        const summaryResponse = await supertest(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookie);
    
        expect(summaryResponse.body.summary.amount).toBe(50);
    });

});

