const express = require("express");

const router = express.Router();
const goCardlessController = require("../controllers/goCardlessController");
// apply json body parser to this route
router.route("/").post(goCardlessController.goCardlessWebhookHandler);

module.exports = router;
