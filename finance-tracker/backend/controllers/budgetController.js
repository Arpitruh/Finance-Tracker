const pool = require("../config/db");

const EXPENSE_CATEGORIES = [
  "groceries",
  "utilities",
  "entertainment",
  "dining",
  "transport",
  "clothing",
  "health",
  "other",
];

const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

const getBudget = async (req, res) => {
  const month = req.query.month || getCurrentMonth();

  try {
    const [rows] = await pool.query(
      `SELECT id, user_id, category, monthly_limit, month, created_at
       FROM budgets
       WHERE user_id = ? AND month = ?
       ORDER BY category ASC`,
      [req.user.userId, month]
    );

    return res.json({ data: rows });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch budgets" });
  }
};

const upsertBudget = async (req, res) => {
  const { category, monthly_limit, month } = req.body;
  const targetMonth = month || getCurrentMonth();

  if (!EXPENSE_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Invalid budget category" });
  }
  if (!monthly_limit || Number(monthly_limit) <= 0) {
    return res.status(400).json({ error: "Monthly limit must be greater than 0" });
  }
  if (!/^\d{4}-\d{2}$/.test(targetMonth)) {
    return res.status(400).json({ error: "Month must be in YYYY-MM format" });
  }

  try {
    const [existing] = await pool.query(
      `SELECT id
       FROM budgets
       WHERE user_id = ? AND category = ? AND month = ?
       LIMIT 1`,
      [req.user.userId, category, targetMonth]
    );

    if (existing.length > 0) {
      const budgetId = existing[0].id;
      await pool.query(
        "UPDATE budgets SET monthly_limit = ? WHERE id = ? AND user_id = ?",
        [monthly_limit, budgetId, req.user.userId]
      );

      const [rows] = await pool.query(
        `SELECT id, user_id, category, monthly_limit, month, created_at
         FROM budgets
         WHERE id = ? AND user_id = ?`,
        [budgetId, req.user.userId]
      );

      return res.json({ data: rows[0] });
    }

    const [insertResult] = await pool.query(
      `INSERT INTO budgets (user_id, category, monthly_limit, month)
       VALUES (?, ?, ?, ?)`,
      [req.user.userId, category, monthly_limit, targetMonth]
    );

    const [rows] = await pool.query(
      `SELECT id, user_id, category, monthly_limit, month, created_at
       FROM budgets
       WHERE id = ? AND user_id = ?`,
      [insertResult.insertId, req.user.userId]
    );

    return res.status(201).json({ data: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: "Failed to save budget" });
  }
};

const deleteBudget = async (req, res) => {
  const budgetId = Number(req.params.id);
  if (!budgetId) {
    return res.status(400).json({ error: "Invalid budget id" });
  }

  try {
    const [result] = await pool.query(
      "DELETE FROM budgets WHERE id = ? AND user_id = ?",
      [budgetId, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Budget not found" });
    }

    return res.json({ data: { id: budgetId } });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete budget" });
  }
};

module.exports = { getBudget, upsertBudget, deleteBudget };
