import supertest from 'supertest';

import createServer from '../server';

const app = createServer();
describe('404 error handler ', () => {
  it('Should return a 404 error with an error message that includes the original url and a status of fail ', async () => {
    // set user email to invalid suffix
    const { statusCode, body } = await supertest(app).get('/unknown-url');
    expect(statusCode).toBe(404);
    expect(body.message).toBe(
      "Can't find the url: /unknown-url on this server",
    );
    expect(body.status).toBe('fail');
  });
});
