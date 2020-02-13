import app from '../src/server';
import sequelize, { Comment } from '../src/models';
import supertest from 'supertest';

const request = supertest(app);

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

describe('Lists all comments', () => {
  it('Gets an empty list if database is empty', async done => {
    const response = await request.get('/api/comments').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);

    done();
  });

  it('Gets all comments ordered by newest', async done => {
    const data = [{ text: 'First comment' }, { text: 'Second comment' }];
    await Comment.create(data[0]);
    await Comment.create(data[1]);

    const response = await request.get('/api/comments').send();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toEqual(expect.objectContaining(data[1]));
    expect(response.body[1]).toEqual(expect.objectContaining(data[0]));

    done();
  });
});
