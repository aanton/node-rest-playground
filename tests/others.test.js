import app from '../src/server';
import supertest from 'supertest';

const request = supertest(app);

describe('Requests an undefined URI', () => {
  it('Fails if the URI is /', async () => {
    const response = await request.get('/').send();

    expect(response).toBeRouteNotFound();
  });

  it('Fails if the URI does not match a route', async () => {
    const response = await request.get('/invalid.uri/').send();

    expect(response).toBeRouteNotFound();
  });
});
