/* eslint-disable import/first  */
import supertest from 'supertest';

import createServer from '../server';

const newUserPayload = {
  consent: true,
  ageConfirm: true,
  homeChoir: 'Some place',
  email: 'test@test.com',
  phoneNumber: '323123423443432',
  postCode: 'ST7 1RR',
  county: 'HomeCounty',
  townOrCity: 'HomeTown',
  streetAddress: '1 The Street',
  lastName: 'Smith',
  firstName: 'John',
};

const app = createServer();
describe('Mandateflow handler ', () => {
  it('Should return an error message when the posted email includes a .ru suffix', async () => {
    newUserPayload.email = 'test@test.ru';
    const { status, body } = await supertest(app).post(
      '/api/gocardless/mandateflow',
    ).send(newUserPayload);
    expect(status).toBe(401);
    expect(body.message).toBe('Please use a valid UK, EU or US email address');
  });

  it('should return redirect url from goCardless ', async () => {
    const { status, body } = await supertest(app)
      .post('/api/gocardless/mandateflow')
      .send(newUserPayload);
    expect(body).toHaveProperty('authorisation_url');
    expect(status).toBe(200);
  });
});
