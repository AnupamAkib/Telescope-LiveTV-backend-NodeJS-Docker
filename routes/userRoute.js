const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.post("/register", userController.registerNewUser);
router.post("/login", userController.login);
router.post("/verifyEmail", userController.verifyEmailAddress);

module.exports = router;