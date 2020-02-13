import app from '../src/server';
import sequelize, { Tag } from '../src/models';
import supertest from 'supertest';

const request = supertest(app);

const checkModelNotFound = response => {
  expect(response.status).toBe(404);
  expect(response.body.error).toBeTruthy();
  expect(response.body.error).toMatch(/Tag.+not found/);
};

const checkModel = (model, expected) => {
  expect(model.id).toBe(expected.id);
  expect(model.name).toBe(expected.name);
  expect(model.slug).toBe(expected.slug);
  expect(model.createdAt).toBeTruthy();
  expect(model.updatedAt).toBeTruthy();
};

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

describe('Gets a tag', () => {
  it('Fails if the tag does not exist', async done => {
    const response = await request.get('/api/tags/1').send();

    checkModelNotFound(response);

    done();
  });

  it('Gets a tag without relationships', async done => {
    const data = { name: 'Tag A', slug: 'tag-a' };
    await Tag.create(data);

    const response = await request.get('/api/tags/1').send();

    expect(response.status).toBe(200);

    const expectedModel = { id: 1, ...data };
    const responseModel = response.body;
    checkModel(responseModel, expectedModel);

    done();
  });

  it.skip('Gets a tag with related comments', {});
});
