import app from '../src/server';
import sequelize, { Post, Tag } from '../src/models';
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
    expect(response.body[0]).toMatchObject(data[0]);
    expect(response.body[1]).toMatchObject(data[1]);

    done();
  });
});

describe('Gets a tag', () => {
  it('Fails if the tag does not exist', async done => {
    const response = await request.get('/api/tags/1').send();

    expect(response).toBeTagNotFound();

    done();
  });

  it('Gets a tag without relationships', async done => {
    const data = { name: 'Tag A', slug: 'tag-a' };
    await Tag.create(data);

    const response = await request.get('/api/tags/1').send();

    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...data, posts: [] };
    expect(response.body).toMatchObject(expectedModel);

    done();
  });

  it('Gets a tag with linked posts', async done => {
    const data = {
      name: 'Tag A',
      slug: 'tag-a',
      posts: [
        { id: 1, title: 'First post' },
        { id: 2, title: 'Second post' },
      ],
    };
    await Tag.create(data, { include: Post });

    const response = await request.get('/api/tags/1').send();

    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...data };
    expectedModel.posts = expectedModel.posts.reverse();
    expect(response.body).toMatchObject(expectedModel);

    done();
  });
});

describe('Deletes a tag', () => {
  it('Fails if the tag does not exist', async done => {
    const response = await request.delete('/api/tags/1').send();

    expect(response).toBeTagNotFound();

    done();
  });

  it('Deletes a tag without linked posts & returns it', async done => {
    const data = { name: 'Tag A', slug: 'tag-a' };
    await Tag.create(data);

    let response = await request.delete('/api/tags/1').send();

    // Checks the response
    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...data };
    expect(response.body).toMatchObject(expectedModel);

    // Checks the database
    const databaseModel = await Tag.findByPk(1);
    expect(databaseModel).toBe(null);

    // Requests the deleted tag
    response = await request.delete('/api/tags/1').send();
    expect(response).toBeTagNotFound();

    done();
  });

  it.skip('Deletes a tag with linked posts & returns it', {});
});
