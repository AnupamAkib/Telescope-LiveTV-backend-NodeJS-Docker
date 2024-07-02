const express = require("express");
const router = express.Router();

const activityController = require("../controllers/activityController");

router.get("/getAll", activityController.getActivity);

module.exports = router;