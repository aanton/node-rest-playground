import app from '../src/server';
import { sequelize, models } from '../src/models';
import supertest from 'supertest';

const request = supertest(app);
const { Comment, Post, Tag } = models;

const posts = [{ title: 'First post' }, { title: 'Second post' }];
const postWithSpecialChars = { title: 'Ⓜ東𣇵🐵📷🐼🎅💯' };

const postWithRelations = {
  title: 'First post with relations',
  comments: [
    { id: 1, text: 'First comment' },
    { id: 2, text: 'Second comment' },
  ],
  tags: [
    { id: 1, name: 'Tag A', slug: 'tag-a' },
    { id: 2, name: 'Tag B', slug: 'tag-b' },
  ],
};

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

describe('Creates a new post', () => {
  it('Fails if the title is missing', async () => {
    const data = {};

    const response = await request
      .post('/api/posts')
      .set('Content-type', 'application/json')
      .send(data);

    expect(response).toBeModelValidationError();
  });

  it('Fails if the title is empty', async () => {
    const data = {
      title: '',
    };

    const response = await request
      .post('/api/posts')
      .set('Content-type', 'application/json')
      .send(data);

    expect(response).toBeModelValidationError();
  });

  it('Fails if the title is too short', async () => {
    const data = {
      title: 'Shhh',
    };

    const response = await request
      .post('/api/posts')
      .set('Content-type', 'application/json')
      .send(data);

    expect(response).toBeModelValidationError();
  });

  it('Saves a post & returns it', async () => {
    const response = await request
      .post('/api/posts')
      .set('Content-type', 'application/json')
      .send(posts[0]);

    // Checks the response
    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...posts[0] };
    expect(response.body).toMatchObject(expectedModel);
    expect(response.body.createdAt).toBeTruthy();
    expect(response.body.createdAt).toBe(response.body.updatedAt);

    // Checks the database
    const databaseModel = await Post.findByPk(1);
    expect(databaseModel).toMatchObject(expectedModel);
    expect(databaseModel.createdAt).toEqual(new Date(response.body.createdAt));
    expect(databaseModel.updatedAt).toEqual(new Date(response.body.updatedAt));
  });

  it('Saves a post with special characters & returns it', async () => {
    const response = await request
      .post('/api/posts')
      .set('Content-type', 'application/json')
      .send(postWithSpecialChars);

    // Checks the response
    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...postWithSpecialChars };
    expect(response.body).toMatchObject(expectedModel);

    // Checks the database
    const databaseModel = await Post.findByPk(1);
    expect(databaseModel).toMatchObject(expectedModel);
  });

  it.skip('Saves a post with tags & returns it', () => {});
});

describe('Lists all posts', () => {
  it('Gets an empty list if database is empty', async () => {
    const response = await request.get('/api/posts').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('Gets all posts ordered by newest', async () => {
    await Post.create(posts[0]);
    await Post.create(posts[1]);

    const response = await request.get('/api/posts').send();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toMatchObject(posts[1]);
    expect(response.body[1]).toMatchObject(posts[0]);
  });
});

describe('Gets a post', () => {
  it('Fails if the post does not exist', async () => {
    const response = await request.get('/api/posts/1').send();

    expect(response).toBePostNotFound();
  });

  it('Gets a post without relationships', async () => {
    await Post.create(posts[0]);

    const response = await request.get('/api/posts/1').send();

    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...posts[0] };
    expect(response.body).toMatchObject(expectedModel);
  });

  it('Gets a post with comments', async () => {
    await Post.create(postWithRelations, { include: Comment });

    const response = await request.get('/api/posts/1').send();

    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...postWithRelations };
    expectedModel.comments = [...expectedModel.comments].reverse(); // Comments are sorted by newest
    delete expectedModel.tags; // Ignore tags
    expect(response.body).toMatchObject(expectedModel);
  });

  it('Gets a post with tags', async () => {
    await Post.create(postWithRelations, { include: Tag });

    const response = await request.get('/api/posts/1').send();

    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...postWithRelations };
    delete expectedModel.comments; // Ignore comments
    expect(response.body).toMatchObject(expectedModel);
  });

  it('Gets a post with all relationships', async () => {
    await Post.create(postWithRelations, { include: [Comment, Tag] });

    const response = await request.get('/api/posts/1').send();

    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...postWithRelations };
    expectedModel.comments = [...expectedModel.comments].reverse(); // Comments are sorted by newest
    expect(response.body).toMatchObject(expectedModel);
  });
});

describe('Updates a post', () => {
  it('Fails if the post does not exist', async () => {
    const data = {};

    const response = await request
      .put('/api/posts/1')
      .set('Content-type', 'application/json')
      .send(data);

    expect(response).toBePostNotFound();
  });

  it('Fails if the title is missing', async () => {
    await Post.create(posts[0]);

    const data = {};

    const response = await request
      .put('/api/posts/1')
      .set('Content-type', 'application/json')
      .send(data);

    expect(response).toBeModelValidationError();
  });

  it('Fails if the title is empty', async () => {
    await Post.create(posts[0]);

    const data = {
      title: '',
    };

    const response = await request
      .put('/api/posts/1')
      .set('Content-type', 'application/json')
      .send(data);

    expect(response).toBeModelValidationError();
  });

  it('Fails if the title is too short', async () => {
    await Post.create(posts[0]);
    const data = {
      title: 'Shhh',
    };

    const response = await request
      .post('/api/posts')
      .set('Content-type', 'application/json')
      .send(data);

    expect(response).toBeModelValidationError();
  });

  it('Updates a post & returns it', async () => {
    await Post.create(posts[0]);

    const data = {
      title: 'First post was updated',
    };

    const response = await request
      .put('/api/posts/1')
      .set('Content-type', 'application/json')
      .send(data);

    // Checks the response
    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...posts[0], ...data };
    expect(response.body).toMatchObject(expectedModel);

    // Checks the database
    const databaseModel = await Post.findByPk(1);
    expect(databaseModel).toMatchObject(expectedModel);
    expect(databaseModel.createdAt).toEqual(new Date(response.body.createdAt));
    expect(databaseModel.updatedAt).toEqual(new Date(response.body.updatedAt));
  });
});

describe('Deletes a post', () => {
  it('Fails if the post does not exist', async () => {
    const response = await request.delete('/api/posts/1').send();

    expect(response).toBePostNotFound();
  });

  it('Deletes a post without relationships & returns it', async () => {
    await Post.create(posts[0]);

    let response = await request.delete('/api/posts/1').send();

    // Checks the response
    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...posts[0] };
    expect(response.body).toMatchObject(expectedModel);

    // Checks the database
    const databaseModel = await Post.findByPk(1);
    expect(databaseModel).toBe(null);

    // Requests the deleted post
    response = await request.delete('/api/posts/1').send();
    expect(response).toBePostNotFound();
  });

  it('Deletes a post with all relationships & returns it', async () => {
    await Post.create(postWithRelations, { include: [Comment, Tag] });

    let response = await request.delete('/api/posts/1').send();

    // Checks the response
    expect(response.status).toBe(200);
    const expectedModel = { id: 1, ...postWithRelations };
    delete expectedModel.comments; // Ignore comments
    delete expectedModel.tags; // Ignore tags
    expect(response.body).toMatchObject(expectedModel);

    // Checks the database
    const databaseModel = await Post.findByPk(1);
    expect(databaseModel).toBe(null);
    const databaseComments = await Comment.findByPost(1);
    expect(databaseComments).toEqual([]);
    const databaseTags = await Tag.findByPost(1);
    expect(databaseTags).toEqual([]);

    // Requests the deleted post
    response = await request.delete('/api/posts/1').send();
    expect(response).toBePostNotFound();
  });
});

describe('Gets all comments of a post', () => {
  it('Fails if the post does not exist', async () => {
    const response = await request.get('/api/posts/1/comments').send();

    expect(response).toBePostNotFound();
  });

  it('Gets an empty list if the post has not comments', async () => {
    await Post.create(posts[0]);

    const response = await request.get('/api/posts/1/comments').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('Gets the comments of a post, ordered by newest', async () => {
    await Post.create(postWithRelations, { include: Comment });

    const response = await request.get('/api/posts/1/comments').send();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    const expectedModels = [...postWithRelations.comments].reverse(); // Comments are sorted by newest
    expect(response.body).toMatchObject(expectedModels);
  });
});

describe('Creates a comment in a post', () => {
  it('Fails if the post does not exist', async () => {
    const response = await request.post('/api/posts/1/comments').send();

    expect(response).toBePostNotFound();
  });

  it('Fails if the text is missing', async () => {
    await Post.create(posts[0]);
    const data = {};

    const response = await request
      .post('/api/posts/1/comments')
      .set('Content-type', 'application/json')
      .send(data);

    expect(response).toBeModelValidationError();
  });

  it('Fails if the text is empty', async () => {
    await Post.create(posts[0]);
    const data = { text: '' };

    const response = await request
      .post('/api/posts/1/comments')
      .set('Content-type', 'application/json')
      .send(data);

    expect(response).toBeModelValidationError();
  });

  it('Creates a comment in a post without previous comments', async () => {
    await Post.create(posts[0]);
    const data = { text: 'A new comment' };

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
  });

  it('Creates a comment in a post that already has comments', async () => {
    await Post.create(postWithRelations, { include: Comment });
    const data = { text: 'A new comment' };

    const response = await request
      .post('/api/posts/1/comments')
      .set('Content-type', 'application/json')
      .send(data);

    // Checks the response
    expect(response.status).toBe(200);
    const expectedId = postWithRelations.comments.length + 1;
    const expectedModel = { id: expectedId, ...data };
    expect(response.body).toMatchObject(expectedModel);

    // Checks the database
    const databaseModel = await Comment.findAll({
      where: {
        postId: 1,
      },
    });
    const expectedComments = [...postWithRelations.comments, expectedModel];
    expect(databaseModel).toMatchObject(expectedComments);
  });
});
