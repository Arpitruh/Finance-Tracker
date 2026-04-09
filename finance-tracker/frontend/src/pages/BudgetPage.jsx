import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import { get, post } from "../services/api";
import { formatCurrency } from "../utils/format";

const categories = [
  "groceries",
  "utilities",
  "entertainment",
  "dining",
  "transport",
  "clothing",
  "health",
  "other",
];

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function BudgetPage() {
  const [month, setMonth] = useState(currentMonth());
  const [inputs, setInputs] = useState({});
  const [spendByCategory, setSpendByCategory] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    const [budgetsRes, expensesRes] = await Promise.all([
      get(`/api/budget?month=${month}`),
      get(`/api/expenses?month=${month}`),
    ]);
    const budgetMap = {};
    (budgetsRes.data || []).forEach((b) => {
      budgetMap[b.category] = b.monthly_limit;
    });
    setInputs(budgetMap);

    const spend = {};
    (expensesRes.data || []).forEach((expense) => {
      spend[expense.category] = (spend[expense.category] || 0) + Number(expense.amount || 0);
    });
    setSpendByCategory(spend);
  };

  useEffect(() => {
    loadData().catch((e) => setError(e.message));
  }, [month]);

  const saveBudgets = async () => {
    setMessage("");
    setError("");
    try {
      for (const category of categories) {
        const value = Number(inputs[category] || 0);
        if (value <= 0) continue;
        await post("/api/budget", {
          category,
          monthly_limit: value,
          month,
        });
      }
      setMessage("Budgets saved");
      await loadData();
    } catch (e) {
      setError(e.message);
    }
  };

  const getClass = (percent) => {
    if (percent < 70) return "budget-good";
    if (percent <= 90) return "budget-warn";
    return "budget-bad";
  };

  return (
    <AppShell title="Monthly Budgets">
      <section className="surface">
        <div className="filter-bar">
          <div className="field">
            <label>Month</label>
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          </div>
        </div>
        {categories.map((category) => {
          const limit = Number(inputs[category] || 0);
          const spent = spendByCategory[category] || 0;
          const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          return (
            <div className="card" style={{ marginBottom: "10px" }} key={category}>
              <div className="field">
                <label>{category}</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={inputs[category] || ""}
                  onChange={(e) => setInputs((p) => ({ ...p, [category]: e.target.value }))}
                />
              </div>
              <p className="muted">Spent: {formatCurrency(spent)} / Limit: {formatCurrency(limit)}</p>
              <div className="progress-track">
                <div className={`progress-fill ${getClass(percent)}`} style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
        <div className="btn-row mtop">
          <button className="btn btn-primary" type="button" onClick={saveBudgets}>
            Save Budgets
          </button>
        </div>
        {message ? <p className="message success">{message}</p> : null}
        {error ? <p className="message error">{error}</p> : null}
      </section>
    </AppShell>
  );
}

export default BudgetPage;
