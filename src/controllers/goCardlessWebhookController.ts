import { Request, Response } from 'express';
import { format } from 'date-fns';
import { MandateType } from '../types';

const webhooks = require('gocardless-nodejs/webhooks');
const constants = require('gocardless-nodejs/constants');
const gocardless = require('gocardless-nodejs');
const Member = require('../models/member');

const GcAccessToken = process.env.GO_CARDLESS_ACCESS_TOKEN as string;
const webhookEndpointSecret = process.env.GC_WEBHOOK_SECRET as string;

// Check .env.local variables are loaded
if (!GcAccessToken || !webhookEndpointSecret) {
  // eslint-disable-next-line no-console
  console.log('Not all .env.local variables are loaded ‼️ ');
}
const client = gocardless(GcAccessToken, constants.Environments.Sandbox);

// Set of actions to call processEvents with
const webhookActionNames = new Set(['fulfilled', 'created']);

const processEvents = async (event: MandateType) => {
  // date-fns date string
  const currentDate = format(new Date(), 'dd/MM/yyyy');
  // event action string from Gocardless webhook event
  switch (event.action) {
    case 'created':
      // create a new subscription for the customer,
      if (event.links.mandate) {
        await client.subscriptions.create({
          amount: '3000',
          currency: 'GBP',
          name: 'single_subscription',
          interval_unit: 'monthly',
          day_of_month: '1',
          metadata: {
            order_no: 'Show_Choir_single_subscription',
          },
          // mandate to create
          // subscription against
          links: {
            mandate: event.links.mandate,
          },
        });
      }

      break;
    /* Handle new customer sign up */
    case 'fulfilled': {
      // Once the subscription has been set up, 'fulfilled' will be
      // sent from Gocardless, and then we can
      // update the customer record in the DB
      const customer = await client.customers.find(event.links.customer);
      console.log('GC CUSTOMER', customer);
      const returnedCustomer = await Member.findOneAndUpdate(
        { email: customer.email },
        {
          active_mandate: true,
          go_cardless_id: customer.id,
        },
      );
      console.log('MONGO RESULT', returnedCustomer);
      break;
    }
    //* * handle canceled mandate **//
    case 'cancelled': {
      // check if there is a mandate number, as the 'cancelled' action is
      // sent from
      // gocardless with and without it
      if (event.links.mandate) {
        // query Go Cardless for the mandate
        const mandate = await client.mandates.find(event.links.mandate);
        // // get Go Cardless customer ID from the mandate object
        const Id = mandate.links.customer;
        // // query Go Cardless for the actual customer details
        const canceledCustomer = await client.customers.find(Id);

        await Member.findOneAndUpdate(
          { email: `${canceledCustomer.email}` },
          {
            active_mandate: false,
            mandate: '',
            go_cardless_id: '',
            direct_debit_cancelled: currentDate,
          },
        ).catch((err: any) => {
          console.log(err);
        });
      }
      break;
    }
    default:
      console.log(event);
  }
};
// Handle the coming Webhook and check its signature, this is from
// Gocardless docs.

exports.goCardlessWebhookHandler = async (req: Request, res: Response) => {
  try {
    const eventsRequestBody = req.body;
    // get signature from headers
    const signatureHeader = req.headers['webhook-signature'];
    console.log('Header', req.headers);
    // Handle the incoming Webhook and check its signature, this is from
    // Gocardless docs.
    const parseEvents = (
      requestBody: any,
      header: any, // From webhook header
      // eslint-disable-next-line consistent-return
    ) => {
      try {
        return webhooks.parse(requestBody, webhookEndpointSecret, header);
      } catch (error) {
        if (error instanceof webhooks.InvalidSignatureError) {
          console.log('invalid signature, look out!');
        }
      }
    };
    // check signature and if OK return an array of events
    const eventsArray = parseEvents(eventsRequestBody, signatureHeader);
    //  if there is an array pass to event handler function*/

    eventsArray.map(async (event: MandateType) => {
      if (webhookActionNames.has(event.action)) {
        await processEvents(event);
      }
    });
    res.status(200);
  } catch (err: any) {
    const message = err.toString();
    res.status(403).json({ message });
  }
};
