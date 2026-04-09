const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const registerValidators = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const getValidationError = (req) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return null;
  return errors.array()[0].msg;
};

const register = async (req, res) => {
  const validationError = getValidationError(req);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { name, email, password } = req.body;

  try {
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return res.status(201).json({ message: "Account created" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create account" });
  }
};

const loginValidators = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const login = async (req, res) => {
  const validationError = getValidationError(req);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { email, password } = req.body;

  try {
    const [users] = await pool.query(
      "SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to login" });
  }
};

const changePasswordValidators = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];

const changePassword = async (req, res) => {
  const validationError = getValidationError(req);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { currentPassword, newPassword } = req.body;

  if (currentPassword === newPassword) {
    return res.status(400).json({ error: "New password must be different" });
  }

  try {
    const [users] = await pool.query(
      "SELECT id, password FROM users WHERE id = ? LIMIT 1",
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];
    const passwordMatches = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      req.user.userId,
    ]);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update password" });
  }
};

module.exports = {
  registerValidators,
  register,
  loginValidators,
  login,
  changePasswordValidators,
  changePassword,
};
