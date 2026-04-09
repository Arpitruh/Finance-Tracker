const express = require("express");
const {
  registerValidators,
  register,
  loginValidators,
  login,
  changePasswordValidators,
  changePassword,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerValidators, register);
router.post("/login", loginValidators, login);
router.put("/change-password", authMiddleware, changePasswordValidators, changePassword);

module.exports = router;
