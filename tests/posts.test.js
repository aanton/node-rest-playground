import app from '../src/server';
import sequelize, { Post } from '../src/models';
import supertest from 'supertest';

const request = supertest(app);

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

describe('Creates a new post', () => {
  it('Fails if the title is missing', async done => {
    const data = {};

    const response = await request
      .post('/api/posts')
      .set('Content-type', 'application/json')
      .send(data);

    expect(response.status).toBe(500);
    expect(response.body.error).toBeTruthy();
    expect(response.body.error).toMatch(/SequelizeValidationError/);

    done();
  });

  it('Fails if the title is empty', async done => {
    const data = {
      title: '',
    };

    const response = await request
      .post('/api/posts')
      .set('Content-type', 'application/json')
      .send(data);

    expect(response.status).toBe(500);
    expect(response.body.error).toBeTruthy();
    expect(response.body.error).toMatch(/SequelizeValidationError/);

    done();
  });

  it('Saves a post in the database & returns it with all its attributes', async done => {
    const data = {
      title: 'My first test post',
    };

    const response = await request
      .post('/api/posts')
      .set('Content-type', 'application/json')
      .send(data);

    // Check response
    expect(response.status).toBe(200);
    expect(typeof response.body.id).toBe('number');
    expect(response.body.title).toBe(data.title);
    expect(response.body.createdAt).toBeTruthy();
    expect(response.body.updatedAt).toBeTruthy();
    expect(response.body.createdAt).toBe(response.body.updatedAt);

    // Search the post in the database
    const dbPost = await Post.findByPk(response.body.id);
    expect(dbPost.title).toBe(data.title);
    expect(dbPost.id).toBe(response.body.id);
    expect(dbPost.createdAt).toEqual(new Date(response.body.createdAt));
    expect(dbPost.updatedAt).toEqual(new Date(response.body.updatedAt));

    done();
  });
});

describe('Lists all posts', () => {
  it('Gets an empty list if database is empty', async done => {
    const response = await request.get('/api/posts').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);

    done();
  });

  it('Gets all posts ordered by newest', async done => {
    const data = [{ title: 'First post' }, { title: 'Second post' }];
    await Post.create(data[0]);
    await Post.create(data[1]);

    const response = await request.get('/api/posts').send();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toEqual(expect.objectContaining(data[1]));
    expect(response.body[1]).toEqual(expect.objectContaining(data[0]));

    done();
  });
});
