import app from '../src/server';
import { sequelize, models } from '../src/models';
import supertest from 'supertest';

const request = supertest(app);
const { Comment } = models;

const comments = [{ text: 'First comment' }, { text: 'Second comment' }];

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

describe('Lists all comments', () => {
  it('Gets an empty list if database is empty', async () => {
    const response = await request.get('/api/comments').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('Gets all comments ordered by newest', async () => {
    await Comment.create(comments[0]);
    await Comment.create(comments[1]);

    const response = await request.get('/api/comments').send();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toMatchObject(comments[1]);
    expect(response.body[1]).toMatchObject(comments[0]);
  });
});

describe('Searches comments', () => {
  beforeEach(async () => {
    await Comment.create(comments[0]);
    await Comment.create(comments[1]);
  });

  it('Fails if the query is missing', async () => {
    const response = await request.get(`/api/comments/search`).send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Search parameter is empty/invalid');
  });

  it('Fails if the query is empty', async () => {
    const query = '';
    const response = await request
      .get(`/api/comments/search?q=${query}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Search parameter is empty/invalid');
  });

  it('Fails if the query is too short', async () => {
    const query = 'co';
    const response = await request
      .get(`/api/comments/search?q=${query}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Search parameter is too short');
  });

  it('Gets an empty list if there are not matched comments', async () => {
    const query = 'abracadabra';
    const response = await request
      .get(`/api/comments/search?q=${query}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('Gets all matched comments ordered by newest', async () => {
    const query = 'comment';
    const response = await request
      .get(`/api/comments/search?q=${query}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toMatchObject(comments[1]);
    expect(response.body[1]).toMatchObject(comments[0]);
  });
});

describe('Deletes a comment', () => {
  it('Fails if the comment does not exist', async () => {
    const response = await request.delete('/api/comments/1').send();

    expect(response).toBeCommentNotFound();
  });

  it('Deletes a comment & returns it', async () => {
    await Comment.create(comments[0]);

    let response = await request.delete('/api/comments/1').send();

    // Checks the response
    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...comments[0] };
    expect(response.body).toMatchObject(expectedModel);

    // Checks the database
    const databaseModel = await Comment.findByPk(1);
    expect(databaseModel).toBe(null);
  });
});
