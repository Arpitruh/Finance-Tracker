const pool = require("../config/db");

const getTransactions = async (req, res) => {
  const { type, start_date, end_date, search } = req.query;
  const userId = req.user.userId;

  const canShowExpense = !type || type === "expense";
  const canShowIncome = !type || type === "income";

  if (type && !["expense", "income"].includes(type)) {
    return res.status(400).json({ error: "Invalid transaction type filter" });
  }

  const items = [];

  try {
    if (canShowExpense) {
      const expenseConditions = ["user_id = ?"];
      const expenseParams = [userId];

      if (start_date) {
        expenseConditions.push("date >= ?");
        expenseParams.push(start_date);
      }
      if (end_date) {
        expenseConditions.push("date <= ?");
        expenseParams.push(end_date);
      }
      if (search) {
        expenseConditions.push("description LIKE ?");
        expenseParams.push(`%${search}%`);
      }

      const [expenseRows] = await pool.query(
        `SELECT id, user_id, amount, category, description, date, created_at
         FROM expenses
         WHERE ${expenseConditions.join(" AND ")}`,
        expenseParams
      );

      for (const expense of expenseRows) {
        items.push({ ...expense, type: "expense" });
      }
    }

    if (canShowIncome) {
      const incomeConditions = ["user_id = ?"];
      const incomeParams = [userId];

      if (start_date) {
        incomeConditions.push("date >= ?");
        incomeParams.push(start_date);
      }
      if (end_date) {
        incomeConditions.push("date <= ?");
        incomeParams.push(end_date);
      }
      if (search) {
        incomeConditions.push("source LIKE ?");
        incomeParams.push(`%${search}%`);
      }

      const [incomeRows] = await pool.query(
        `SELECT id, user_id, source, amount, frequency, date, is_recurring, created_at
         FROM income
         WHERE ${incomeConditions.join(" AND ")}`,
        incomeParams
      );

      for (const income of incomeRows) {
        items.push({ ...income, type: "income" });
      }
    }

    items.sort((a, b) => {
      const byDate = new Date(b.date) - new Date(a.date);
      if (byDate !== 0) return byDate;
      return b.id - a.id;
    });

    return res.json({ data: items });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

module.exports = { getTransactions };
