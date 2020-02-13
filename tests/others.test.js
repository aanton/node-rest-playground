import app from '../src/server';
import supertest from 'supertest';

const request = supertest(app);

describe('Requests an undefined URI', () => {
  it('Fails if the URI is /', async done => {
    const response = await request.get('/').send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
    expect(response.body.error).toMatch(/Route not found/);

    done();
  });

  it('Fails if the URI does not match a route', async done => {
    const response = await request.get('/invalid.uri/').send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
    expect(response.body.error).toMatch(/Route not found/);

    done();
  });
});
