import { Request, Response } from 'express';
import config from 'config';

const gocardless = require('gocardless-nodejs');
const constants = require('gocardless-nodejs/constants');

const Member = require('../models/member');

const gocardlessAccessToken = config.get('goCardlessAccessToken');
const client = gocardless(
  gocardlessAccessToken,
  constants.Environments.Sandbox,
);
// eslint-disable-next-line consistent-return
exports.goCardlessMandateFlowHandler = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    address,
    city,
    email,
    county,
    postCode,
    phoneNumber,
    streetAddress,
    townOrCity,
    ageConfirm,
    homeChoir,
    consent,
  } = req.body;
  // trim and lower case email to get over a mongo query problem
  const parsedEmail = email.toLowerCase().trim();
  // check for spam .ru emails
  const pattern = /.ru$/;
  const match = parsedEmail.match(pattern);
  if (match) {
    return res
      .status(401)
      .json({ message: 'Please use a valid UK, EU or US email address' });
  }

  const createMandateRequestURL = async () => {
    // create a billing request returns a request id string
    const { id } = await client.billingRequests.create({
      mandate_request: {
        scheme: 'bacs',
      },
    });
    // add prefilled customer detail to the direct debit form
    const billingRequestFlow = await client.billingRequestFlows.create({
      redirect_uri: 'https://www.google.com',
      exit_uri: 'https://www.google.com',
      prefilled_customer: {
        given_name: firstName,
        family_name: lastName,
        address_line1: address,
        city,
        region: county,
        postal_code: postCode,
        email: parsedEmail,
      },
      /* id generated by the Gocardless aip */
      links: {
        billing_request: id,
      },
    });
    // send the billingRequestFlow object containing the redirect url for
    // the hosted signup form
    res.status(200).json(billingRequestFlow);
  };
  /* Create new customer object with all fields needed, even if blank,
   these will be populated, by the Gocardless webhook in another handler */
  const newMemberData = {
    first_name: firstName,
    last_name: lastName,
    email: parsedEmail,
    post_code: postCode,
    phone_number: phoneNumber,
    street_address: streetAddress,
    town_city: townOrCity,
    county,
    age_confirm: ageConfirm,
    home_choir: homeChoir,
    consent,
    active_mandate: false,
    mandate: '',
    membership_type: 'DD',
    go_cardless_id: '',
  };

  // this runs first adding new customer info to the database or updating
  // an existing customer
  await Member.create(newMemberData)
    .then(await createMandateRequestURL())
    .catch((err: any) => {
      console.log('ERROR SAVING DOCUMENT', err);

      return res.status(500).json({
        message:
          'Oops, there seems to be a problem, please try again'
          + ' later or give us a call',
      });
    });
};
