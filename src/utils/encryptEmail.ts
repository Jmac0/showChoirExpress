import * as crypto from 'crypto';

const config = require('config');

const algorithm = config.get('cypherAlgorithm');
const secretKey = crypto.scryptSync(config.get('emailCypherSecret'), 'salt', 32);
const iv = crypto.randomBytes(16);
// Function to hash email for use as url param, returns hashed email as string
const encryptEmail = (email: string): string => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encryptedEmail = cipher.update(email, 'utf8', 'hex');
  encryptedEmail += cipher.final('hex');
  return encryptedEmail;
};

export { encryptEmail };
