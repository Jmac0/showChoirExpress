/* eslint-disable import/first  */
import supertest from 'supertest';

import createServer from '../server';
import { createWebhookSignature } from '../utils/createWebhookSignature';
import Member from '../models/member';

const app = createServer();
// create a mock webhook body for a fulfilled action
const mockFulfilledWebhookBody = {
  events: [
    {
      action: 'fulfilled',
      links: { customer: 'CU000X6JX8BVFB', mandate: 'MD000TWG05DHXR' },
    },
  ],
};
it(
  'Should return a 200 response and update the customer DB record with the go_cardless_id & set the active mandate'
    + ' property to true ',
  async () => {
    // Pass mock webhook body in to createWebhookSignature to create a secret key & json body
    const { webhookSignature, webhookBody } = createWebhookSignature(
      mockFulfilledWebhookBody,
    );
    const { status } = await supertest(app)
      .post('/api/gocardless/webhooks')
      .set('Content-Type', 'application/json')
      .set('webhook-signature', webhookSignature)
      .send(webhookBody);
    expect(status).toBe(200);
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const updatedMemberArray = await Member.find({
      email: 'development1@development.com',
    });
    expect(updatedMemberArray[0].active_mandate).toBe(true);
    expect(updatedMemberArray[0].go_cardless_id).toBe('CU000X6JX8BVFB');
  },
);
