const express = require("express");
const authGuard = require("../middlewares/authGuard");
const router = express.Router();

const userController = require("../controllers/userController");

router.post("/register", userController.registerNewUser);
router.post("/login", userController.login);
router.post("/verifyEmail", userController.verifyEmailAddress);
router.post("/verifyToken", authGuard, userController.verifyToken);

module.exports = router;