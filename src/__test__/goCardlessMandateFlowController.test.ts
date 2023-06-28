/* eslint-disable import/first  */
import supertest from 'supertest';
import createServer from '../server';

import Member from '../models/member';

const validUserPayload = {
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
const inValidUserPayload = {
  consent: true,
  ageConfirm: true,
  homeChoir: 'Some place',
  email: 'test@test.ru',
  phoneNumber: '323123423443432',
  postCode: 'ST7 1RR',
  county: 'HomeCounty',
  townOrCity: 'HomeTown',
  streetAddress: '1 The Street',
  lastName: 'Smith',
  firstName: 'John',
};
const app = createServer();
describe('MandateFlowController', () => {
  beforeAll(async () => {
    await Member.deleteOne({ email: 'test@test.com' });
  });

  afterAll(async () => {
    await Member.deleteOne({ email: 'test@test.com' });
  });

  it('Should return an error message when the posted email includes a .ru suffix', async () => {
    // set user email to invalid suffix
    const {
      status,
      body,
    } = await supertest(app)
      .post('/api/gocardless/mandateflow')
      .send(inValidUserPayload);
    expect(status)
      .toBe(401);
    expect(body.message)
      .toBe(
        'Please provide a valid UK, EU or US email address',
      );
  });

  it(
    'should return redirect url from goCardless and save the valid'
    + ' user data to the test database',
    async () => {
      const {
        status,
        body,
      } = await supertest(app)
        .post('/api/gocardless/mandateflow')
        .send(validUserPayload);
      expect(body)
        .toHaveProperty('authorisation_url');
      expect(status)
        .toBe(200);
      const userQueryArray = await Member.find({ email: 'test@test.com' });
      expect(userQueryArray.length)
        .toBe(1);
    },
  );
});
