import supertest from 'supertest';
import app from '../src/app';
import itemFactory from '../prisma/factories/itemFactory';
import { prisma } from '../src/database';

beforeEach(async () => {
  await prisma.$queryRaw`TRUNCATE TABLE items CASCADE;`;
  await prisma.$queryRaw`ALTER SEQUENCE items_id_seq RESTART WITH 1;`;
});

describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const newItem = itemFactory();
    const response = await supertest(app).post('/items').send(newItem);
    expect(response.status).toEqual(201);
  });
  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
    const newItem = itemFactory();
    await prisma.items.create({data: newItem});
    const response = await supertest(app).post('/items').send(newItem);
    expect(response.status).toEqual(409);
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async () => {
    await prisma.items.create({data: itemFactory()});
    await prisma.items.create({data: itemFactory()});
    const response = await supertest(app).get('/items');
    expect(response.status).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
    const newItem = itemFactory();
    await prisma.items.create({data: newItem});
    const response = await supertest(app).get('/items/1');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({...newItem, id: 1});
  });
  it('Deve retornar status 404 caso não exista um item com esse id', async () => {
    const response = await supertest(app).get('/items/1');
    expect(response.status).toEqual(404);
  });
});
