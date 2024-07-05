const express = require("express");
const router = express.Router();
const authGuard = require("../middlewares/authGuard");

const activityController = require("../controllers/activityController");

router.get("/getAll", authGuard, activityController.getActivity);

module.exports = router;