const express = require("express");
const router = express.Router();
const authGuard = require("../middlewares/authGuard");

const channelController = require("../controllers/channelController");

router.get("/", authGuard, channelController.getAllChannels); //protected route
router.post("/checkAvailability", authGuard, channelController.checkChannelAvailableToUser); //protected route

module.exports = router;