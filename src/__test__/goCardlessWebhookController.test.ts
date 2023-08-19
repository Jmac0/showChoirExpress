/* eslint-disable import/first  */
import supertest from "supertest";
import config from "config";
import createServer from "../server";
import { createWebhookSignature } from "../utils/createWebhookSignature";
import Member from "../models/member";

const app = createServer();

// Mock goCardless customer number & mandate
const goCardlessCustomerNumber = config.get<string>("mockGoCardlessCustomer");
const goCardlessMandate = config.get<string>("mockGoCardlessMandate");
// Mock webhook body for a fulfilled action
const mockFulfilledWebhookBody = {
  events: [
    {
      action: "fulfilled",
      links: {
        customer: goCardlessCustomerNumber,
        mandate: goCardlessMandate,
      },
    },
  ],
};
// Mock webhook body for cancelled action
const mockCanceledWebhookBody = {
  events: [
    {
      action: "cancelled",
      links: {
        mandate: goCardlessMandate,
      },
    },
  ],
};
// Mock user with initial state once added to DB
const goCardlessTestUser = {
  email: "development1@development.com",
  go_cardless_id: "",
  active_mandate: false,
  active_member: false,
};
// setup and teardown the user in the DB
describe("Go cardless webhook handler function ", () => {
  beforeAll(async () => {
    await Member.create(goCardlessTestUser);
  });

  afterAll(async () => {
    await Member.deleteMany();
  });

  it(
    "Should return a 200 response and update the customer DB record with the go_cardless_id & set the active_mandate" +
      " property to true ",
    async () => {
      // Pass mock webhook body into createWebhookSignature function to create a secret key & json
      // body
      const { webhookSignature, webhookBody } = createWebhookSignature(
        mockFulfilledWebhookBody
      );
      const { status } = await supertest(app)
        .post("/api/gocardless/webhooks")
        .set("Content-Type", "application/json")
        .set("webhook-signature", webhookSignature)
        .send(webhookBody);
      expect(status).toBe(200);
      // wait for 1 second for the database to update
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedMemberArray = await Member.find({
        email: "development1@development.com",
      });
      expect(updatedMemberArray[0].active_mandate).toBe(true);
      expect(updatedMemberArray[0].active_member).toBe(true);
      expect(updatedMemberArray[0].go_cardless_id).toBe(
        goCardlessCustomerNumber
      );
    }
  );
  it(
    "Should return a 200 response, update the customer DB record, set the go_cardless_id" +
      " to an empty string and set the active_mandate property to false ",
    async () => {
      // Pass mock webhook body into createWebhookSignature to create a secret key & json body
      const { webhookSignature, webhookBody } = createWebhookSignature(
        mockCanceledWebhookBody
      );
      const { status } = await supertest(app)
        .post("/api/gocardless/webhooks")
        .set("Content-Type", "application/json")
        .set("webhook-signature", webhookSignature)
        .send(webhookBody);
      expect(status).toBe(200);
      // wait for 1 second for the database to update
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedMemberArray = await Member.find({
        email: "development1@development.com",
      });
      expect(updatedMemberArray[0].active_mandate).toBe(false);
      expect(updatedMemberArray[0].go_cardless_id).toBe("");
    }
  );
});
