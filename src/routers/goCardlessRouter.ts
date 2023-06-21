import express from 'express';
import goCardlessWebhookHandler from '../controllers/goCardlessWebhookController';
import goCardlessMandateFlowController from '../controllers/goCardlessMandateFlowController';

const router = express.Router();
// apply json body parser to this route
router
  .route('/mandateflow')
  .post(
    express.json(),
    goCardlessMandateFlowController,
  );
router
  .route('/webhooks')
  .post(
    express.text({ type: 'application/json' }),
    goCardlessWebhookHandler,
  );

module.exports = router;
