const pool = require("../config/db");

const INCOME_FREQUENCIES = ["one-time", "weekly", "monthly"];

const getIncome = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, user_id, source, amount, frequency, date, is_recurring, created_at
       FROM income
       WHERE user_id = ?
       ORDER BY date DESC, id DESC`,
      [req.user.userId]
    );

    return res.json({ data: rows });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch income records" });
  }
};

const createIncome = async (req, res) => {
  const { source, amount, frequency, date, is_recurring = false } = req.body;

  if (!source || !String(source).trim()) {
    return res.status(400).json({ error: "Source is required" });
  }
  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ error: "Amount must be greater than 0" });
  }
  if (!INCOME_FREQUENCIES.includes(frequency)) {
    return res.status(400).json({ error: "Invalid income frequency" });
  }
  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO income (user_id, source, amount, frequency, date, is_recurring)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.userId, source, amount, frequency, date, Boolean(is_recurring)]
    );

    const [rows] = await pool.query(
      `SELECT id, user_id, source, amount, frequency, date, is_recurring, created_at
       FROM income
       WHERE id = ? AND user_id = ?`,
      [result.insertId, req.user.userId]
    );

    return res.status(201).json({ data: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create income record" });
  }
};

const updateIncome = async (req, res) => {
  const incomeId = Number(req.params.id);
  const { source, amount, frequency, date, is_recurring = false } = req.body;

  if (!incomeId) {
    return res.status(400).json({ error: "Invalid income id" });
  }
  if (!source || !String(source).trim()) {
    return res.status(400).json({ error: "Source is required" });
  }
  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ error: "Amount must be greater than 0" });
  }
  if (!INCOME_FREQUENCIES.includes(frequency)) {
    return res.status(400).json({ error: "Invalid income frequency" });
  }
  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE income
       SET source = ?, amount = ?, frequency = ?, date = ?, is_recurring = ?
       WHERE id = ? AND user_id = ?`,
      [
        source,
        amount,
        frequency,
        date,
        Boolean(is_recurring),
        incomeId,
        req.user.userId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Income record not found" });
    }

    const [rows] = await pool.query(
      `SELECT id, user_id, source, amount, frequency, date, is_recurring, created_at
       FROM income
       WHERE id = ? AND user_id = ?`,
      [incomeId, req.user.userId]
    );

    return res.json({ data: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update income record" });
  }
};

const deleteIncome = async (req, res) => {
  const incomeId = Number(req.params.id);
  if (!incomeId) {
    return res.status(400).json({ error: "Invalid income id" });
  }

  try {
    const [result] = await pool.query(
      "DELETE FROM income WHERE id = ? AND user_id = ?",
      [incomeId, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Income record not found" });
    }

    return res.json({ data: { id: incomeId } });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete income record" });
  }
};

module.exports = { getIncome, createIncome, updateIncome, deleteIncome };
