import app from '../src/server';
import sequelize, { Comment, Post } from '../src/models';
import supertest from 'supertest';

const request = supertest(app);

const checkModelValidationError = response => {
  expect(response.status).toBe(500);
  expect(response.body.error).toBeTruthy();
  expect(response.body.error).toMatch(/SequelizeValidationError/);
};

const checkModelNotFound = response => {
  expect(response.status).toBe(404);
  expect(response.body.error).toBeTruthy();
  expect(response.body.error).toMatch(/Post.+not found/);
};

const checkModel = (model, expected) => {
  expect(model.id).toBe(expected.id);
  expect(model.title).toBe(expected.title);
  expect(model.createdAt).toBeTruthy();
  expect(model.updatedAt).toBeTruthy();
};

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

    checkModelValidationError(response);

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

    checkModelValidationError(response);

    done();
  });

  it.skip('Fails if the title is too short', {});

  it('Saves a post & returns it', async done => {
    const data = {
      title: 'My first test post',
    };

    const response = await request
      .post('/api/posts')
      .set('Content-type', 'application/json')
      .send(data);

    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...data };

    // Checks the response
    const responseModel = response.body;
    checkModel(responseModel, expectedModel);
    expect(responseModel.createdAt).toBe(responseModel.updatedAt);

    // Checks the database
    const databaseModel = await Post.findByPk(responseModel.id);
    checkModel(databaseModel, expectedModel);
    expect(databaseModel.createdAt).toEqual(new Date(responseModel.createdAt));
    expect(databaseModel.updatedAt).toEqual(new Date(responseModel.updatedAt));

    done();
  });

  it.skip('Saves a post with tags & returns it', {});
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

describe('Gets a post', () => {
  it('Fails if the post does not exist', async done => {
    const response = await request.get('/api/posts/1').send();

    checkModelNotFound(response);

    done();
  });

  it('Gets a post without relationships', async done => {
    const data = { title: 'First post' };
    await Post.create(data);

    const response = await request.get('/api/posts/1').send();

    expect(response.status).toBe(200);

    const expectedModel = { id: 1, ...data };
    const responseModel = response.body;
    checkModel(responseModel, expectedModel);

    done();
  });

  it.skip('Gets a post with comments', {});
  it.skip('Gets a post with tags', {});
  it.skip('Gets a post with all relationships', {});
});

describe('Updates a post', () => {
  it('Fails if the post does not exist', async done => {
    const data = {};

    const response = await request
      .put('/api/posts/1')
      .set('Content-type', 'application/json')
      .send(data);

    checkModelNotFound(response);

    done();
  });

  it('Fails if the title is missing', async done => {
    const previousData = { title: 'First post' };
    await Post.create(previousData);

    const data = {};

    const response = await request
      .put('/api/posts/1')
      .set('Content-type', 'application/json')
      .send(data);

    checkModelValidationError(response);

    done();
  });

  it('Fails if the title is empty', async done => {
    const previousData = { title: 'First post' };
    await Post.create(previousData);

    const data = {
      title: '',
    };

    const response = await request
      .put('/api/posts/1')
      .set('Content-type', 'application/json')
      .send(data);

    checkModelValidationError(response);

    done();
  });

  it.skip('Fails if the title is too short', {});

  it('Updates a post & returns it', async done => {
    const previousData = { title: 'First post' };
    await Post.create(previousData);

    const data = {
      title: 'First post was updated',
    };

    const response = await request
      .put('/api/posts/1')
      .set('Content-type', 'application/json')
      .send(data);

    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...data };

    // Checks the response
    const responseModel = response.body;
    checkModel(responseModel, expectedModel);

    // Checks the database
    const databaseModel = await Post.findByPk(responseModel.id);
    checkModel(databaseModel, expectedModel);
    expect(databaseModel.createdAt).toEqual(new Date(responseModel.createdAt));
    expect(databaseModel.updatedAt).toEqual(new Date(responseModel.updatedAt));

    done();
  });
});

describe('Deletes a post', () => {
  it('Fails if the post does not exist', async done => {
    const response = await request
      .delete('/api/posts/1')
      .set('Content-type', 'application/json')
      .send();

    checkModelNotFound(response);

    done();
  });

  it('Deletes a post & returns it', async done => {
    const data = { title: 'First post' };
    await Post.create(data);

    let response = await request
      .delete('/api/posts/1')
      .set('Content-type', 'application/json')
      .send();

    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...data };

    // Checks the response
    const responseModel = response.body;
    checkModel(responseModel, expectedModel);

    // Checks the database
    const databaseModel = await Post.findByPk(response.body.id);
    expect(databaseModel).toBe(null);

    // Requests the deleted post
    response = await request
      .delete('/api/posts/1')
      .set('Content-type', 'application/json')
      .send();
    checkModelNotFound(response);

    done();
  });

  it.skip('Deletes a post with comments', {});
  it.skip('Deletes a post with tags', {});
  it.skip('Deletes a post with all relationships', {});
});

describe('Gets all comments of a post', () => {
  it('Fails if the post does not exist', async done => {
    const response = await request.get('/api/posts/1/comments').send();

    checkModelNotFound(response);

    done();
  });

  it('Gets an empty list if the post has not comments', async done => {
    const data = { title: 'First post' };
    await Post.create(data);

    const response = await request.get('/api/posts/1/comments').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);

    done();
  });

  it('Gets the comments of a post, ordered by newest', async done => {
    const data = {
      title: 'First post',
      comments: [{ text: 'First comment' }, { text: 'Second comment' }],
    };
    await Post.create(data, { include: Comment });

    const response = await request.get('/api/posts/1/comments').send();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toEqual(expect.objectContaining(data.comments[1]));
    expect(response.body[1]).toEqual(expect.objectContaining(data.comments[0]));

    done();
  });
});
