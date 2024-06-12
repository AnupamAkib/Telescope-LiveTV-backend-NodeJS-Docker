const express = require("express");
const router = express.Router();

const channelController = require("../controllers/channelController");

router.get("/getAll", channelController.getAllChannels);

module.exports = router;