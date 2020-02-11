import app from '../src/server';
import sequelize, { Post } from '../src/models';
import supertest from 'supertest';

const request = supertest(app);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

it('Should save post to database', async done => {
  const post = {
    title: 'My first test post',
  };

  const response = await request
    .post('/api/posts')
    .set('Content-type', 'application/json')
    .send(post);

  // Check response
  expect(response.status).toBe(200);
  expect(typeof response.body.id).toBe('number');
  expect(response.body.title).toBe(post.title);
  expect(response.body.createdAt).toBeTruthy();
  expect(response.body.updatedAt).toBeTruthy();

  // Search the post in the database
  const dbPost = await Post.findByPk(response.body.id);
  expect(response.body.id).toBe(dbPost.id);
  expect(response.body.title).toBe(dbPost.title);
  expect(dbPost.createdAt).toBeTruthy();
  expect(dbPost.updatedAt).toBeTruthy();

  done();
});
