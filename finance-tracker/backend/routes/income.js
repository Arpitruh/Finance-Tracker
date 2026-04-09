const express = require("express");
const {
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
} = require("../controllers/incomeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getIncome);
router.post("/", createIncome);
router.put("/:id", updateIncome);
router.delete("/:id", deleteIncome);

module.exports = router;
