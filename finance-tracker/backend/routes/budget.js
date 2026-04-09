const express = require("express");
const {
  getBudget,
  upsertBudget,
  deleteBudget,
} = require("../controllers/budgetController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getBudget);
router.post("/", upsertBudget);
router.delete("/:id", deleteBudget);

module.exports = router;
