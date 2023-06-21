const mongoose = require('mongoose');
const config = require('config');

const mongoTestUriString = config.get('mongoTestUri');
beforeAll(async () => {
  await mongoose.connect(mongoTestUriString);
});
afterAll(async () => {
  await mongoose.connection.close();
});
