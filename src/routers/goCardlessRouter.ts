const express = require("express");
var bodyParser = require('body-parser')
const router = express.Router();
const goCardlessWebhookController = require("../controllers/goCardlessWebhookController");
const goCardlessMandateFlowController = require("../controllers/goCardlessMandateFlowController");
// apply json body parser to this route
router.route("/mandateflow").post(express.json(), goCardlessMandateFlowController.goCardlessMandateFlowHandler );
router.route("/webhooks").post(express.text({type: "application/json"}),goCardlessWebhookController.goCardlessWebhookHandler);




module.exports = router;
