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

const getExpenses = async (req, res) => {
  const { category, month } = req.query;
  const conditions = ["user_id = ?"];
  const params = [req.user.userId];

  if (category) {
    conditions.push("category = ?");
    params.push(category);
  }

  if (month) {
    conditions.push("DATE_FORMAT(date, '%Y-%m') = ?");
    params.push(month);
  }

  const sql = `
    SELECT id, user_id, amount, category, description, date, created_at
    FROM expenses
    WHERE ${conditions.join(" AND ")}
    ORDER BY date DESC, id DESC
  `;

  try {
    const [rows] = await pool.query(sql, params);
    return res.json({ data: rows });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

const createExpense = async (req, res) => {
  const { amount, category, description = null, date } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ error: "Amount must be greater than 0" });
  }
  if (!EXPENSE_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Invalid expense category" });
  }
  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO expenses (user_id, amount, category, description, date)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.userId, amount, category, description, date]
    );

    const [rows] = await pool.query(
      `SELECT id, user_id, amount, category, description, date, created_at
       FROM expenses
       WHERE id = ? AND user_id = ?`,
      [result.insertId, req.user.userId]
    );

    return res.status(201).json({ data: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create expense" });
  }
};

const updateExpense = async (req, res) => {
  const expenseId = Number(req.params.id);
  const { amount, category, description = null, date } = req.body;

  if (!expenseId) {
    return res.status(400).json({ error: "Invalid expense id" });
  }
  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ error: "Amount must be greater than 0" });
  }
  if (!EXPENSE_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Invalid expense category" });
  }
  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE expenses
       SET amount = ?, category = ?, description = ?, date = ?
       WHERE id = ? AND user_id = ?`,
      [amount, category, description, date, expenseId, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    const [rows] = await pool.query(
      `SELECT id, user_id, amount, category, description, date, created_at
       FROM expenses
       WHERE id = ? AND user_id = ?`,
      [expenseId, req.user.userId]
    );

    return res.json({ data: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update expense" });
  }
};

const deleteExpense = async (req, res) => {
  const expenseId = Number(req.params.id);
  if (!expenseId) {
    return res.status(400).json({ error: "Invalid expense id" });
  }

  try {
    const [result] = await pool.query(
      "DELETE FROM expenses WHERE id = ? AND user_id = ?",
      [expenseId, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    return res.json({ data: { id: expenseId } });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete expense" });
  }
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense };
