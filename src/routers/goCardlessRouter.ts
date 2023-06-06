const express = require("express");

const router = express.Router();
const goCardlessController = require("../controllers/goCardlessController");

router.route("/").post(goCardlessController.goCardlessWebhookHandler);

module.exports = router;
