const express = require("express");
const { getTransactions } = require("../controllers/transactionsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getTransactions);

module.exports = router;
