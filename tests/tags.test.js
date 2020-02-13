import app from '../src/server';
import sequelize, { Tag } from '../src/models';
import supertest from 'supertest';

const request = supertest(app);

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

describe('Lists all tags', () => {
  it('Gets an empty list if database is empty', async done => {
    const response = await request.get('/api/tags').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);

    done();
  });

  it('Gets all tags ordered by name', async done => {
    const data = [
      { name: 'Tag A', slug: 'tag-a' },
      { name: 'Tag B', slug: 'tag-b' },
    ];
    await Tag.create(data[0]);
    await Tag.create(data[1]);

    const response = await request.get('/api/tags').send();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toEqual(expect.objectContaining(data[0]));
    expect(response.body[1]).toEqual(expect.objectContaining(data[1]));

    done();
  });
});
