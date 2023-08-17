import { WebhookTestBodyType } from "../types";

const crypto = require("crypto");

const config = require("config");

const webhookEndpointSecret = config.get("goCardlessWebhookSecret");

// Creates a valid webhook signature & body using the GoCardless secret for use in testing
// takes in a JS object so it can be type checked
export function createWebhookSignature(requestBody: WebhookTestBodyType): {
  webhookSignature: string;
  webhookBody: string;
} {
  /* convert request body to json, this must be used in any test request as the
   formatting matters to the hash */
  const webhookBody = JSON.stringify(requestBody);
  // create Hmac object
  const hmac = crypto.createHmac("sha256", webhookEndpointSecret);
  // pass in the json request body to the hmac
  const input = hmac.update(webhookBody);
  // output the digested string to be used in the webhook-secret request headers
  const webhookSignature = input.digest("hex");
  return {
    webhookSignature,
    webhookBody,
  };
}
