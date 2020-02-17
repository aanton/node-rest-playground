import app from '../src/server';
import sequelize, { Comment, Post } from '../src/models';
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

    expect(response).toBeModelValidationError();

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

    expect(response).toBeModelValidationError();

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

    // Checks the response
    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...data };
    expect(response.body).toMatchObject(expectedModel);
    expect(response.body.createdAt).toBeTruthy();
    expect(response.body.createdAt).toBe(response.body.updatedAt);

    // Checks the database
    const databaseModel = await Post.findByPk(1);
    expect(databaseModel).toMatchObject(expectedModel);
    expect(databaseModel.createdAt).toEqual(new Date(response.body.createdAt));
    expect(databaseModel.updatedAt).toEqual(new Date(response.body.updatedAt));

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
    expect(response.body[0]).toMatchObject(data[1]);
    expect(response.body[1]).toMatchObject(data[0]);

    done();
  });
});

describe('Gets a post', () => {
  it('Fails if the post does not exist', async done => {
    const response = await request.get('/api/posts/1').send();

    expect(response).toBePostNotFound();

    done();
  });

  it('Gets a post without relationships', async done => {
    const data = { title: 'First post' };
    await Post.create(data);

    const response = await request.get('/api/posts/1').send();

    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...data };
    expect(response.body).toMatchObject(expectedModel);

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

    expect(response).toBePostNotFound();

    done();
  });

  it('Fails if the title is missing', async done => {
    await Post.create({ title: 'First post' });

    const data = {};

    const response = await request
      .put('/api/posts/1')
      .set('Content-type', 'application/json')
      .send(data);

    expect(response).toBeModelValidationError();

    done();
  });

  it('Fails if the title is empty', async done => {
    await Post.create({ title: 'First post' });

    const data = {
      title: '',
    };

    const response = await request
      .put('/api/posts/1')
      .set('Content-type', 'application/json')
      .send(data);

    expect(response).toBeModelValidationError();

    done();
  });

  it.skip('Fails if the title is too short', {});

  it('Updates a post & returns it', async done => {
    await Post.create({ title: 'First post' });

    const data = {
      title: 'First post was updated',
    };

    const response = await request
      .put('/api/posts/1')
      .set('Content-type', 'application/json')
      .send(data);

    // Checks the response
    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...data };
    expect(response.body).toMatchObject(expectedModel);

    // Checks the database
    const databaseModel = await Post.findByPk(1);
    expect(databaseModel).toMatchObject(expectedModel);
    expect(databaseModel.createdAt).toEqual(new Date(response.body.createdAt));
    expect(databaseModel.updatedAt).toEqual(new Date(response.body.updatedAt));

    done();
  });
});

describe('Deletes a post', () => {
  it('Fails if the post does not exist', async done => {
    const response = await request.delete('/api/posts/1').send();

    expect(response).toBePostNotFound();

    done();
  });

  it('Deletes a post & returns it', async done => {
    const data = { title: 'First post' };
    await Post.create(data);

    let response = await request.delete('/api/posts/1').send();

    
    // Checks the response
    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...data };
    expect(response.body).toMatchObject(expectedModel);

    // Checks the database
    const databaseModel = await Post.findByPk(1);
    expect(databaseModel).toBe(null);

    // Requests the deleted post
    response = await request.delete('/api/posts/1').send();
    expect(response).toBePostNotFound();

    done();
  });

  it.skip('Deletes a post with comments', {});
  it.skip('Deletes a post with tags', {});
  it.skip('Deletes a post with all relationships', {});
});

describe('Gets all comments of a post', () => {
  it('Fails if the post does not exist', async done => {
    const response = await request.get('/api/posts/1/comments').send();

    expect(response).toBePostNotFound();

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
    expect(response.body[0]).toMatchObject(data.comments[1]);
    expect(response.body[1]).toMatchObject(data.comments[0]);

    done();
  });
});

describe('Creates a comment in a post', () => {
  it('Fails if the post does not exist', async done => {
    const response = await request.post('/api/posts/1/comments').send();

    expect(response).toBePostNotFound();

    done();
  });

  it('Fails if the text is missing', async done => {
    await Post.create({ title: 'First post' });
    const data = {};

    const response = await request
      .post('/api/posts/1/comments')
      .set('Content-type', 'application/json')
      .send(data);

    expect(response).toBeModelValidationError();

    done();
  });

  it('Fails if the text is empty', async done => {
    await Post.create({ title: 'First post' });
    const data = { text: '' };

    const response = await request
      .post('/api/posts/1/comments')
      .set('Content-type', 'application/json')
      .send(data);

    expect(response).toBeModelValidationError();

    done();
  });

  it('Creates a comment in a post without previous comments', async done => {
    await Post.create({ title: 'First post' });
    const data = { text: 'First comment' };

    const response = await request
      .post('/api/posts/1/comments')
      .set('Content-type', 'application/json')
      .send(data);

    // Checks the response
    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...data };
    expect(response.body).toMatchObject(expectedModel);
    expect(response.body.createdAt).toBeTruthy();
    expect(response.body.createdAt).toBe(response.body.updatedAt);

    // Checks the database
    const databaseModel = await Comment.findByPk(1);
    expect(databaseModel).toMatchObject(expectedModel);
    expect(databaseModel.createdAt).toEqual(new Date(response.body.createdAt));
    expect(databaseModel.updatedAt).toEqual(new Date(response.body.updatedAt));

    done();
  });

  it.skip('Creates a comment in a post that already has comments', {});
});
