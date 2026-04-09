import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import { del, get, post, put } from "../services/api";
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

const initialForm = { amount: "", category: "groceries", description: "", date: "" };

function ExpensesPage() {
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(initialForm);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const loadExpenses = async () => {
    const params = new URLSearchParams();
    if (filterCategory) params.set("category", filterCategory);
    if (filterMonth) params.set("month", filterMonth);
    const query = params.toString();
    const result = await get(`/api/expenses${query ? `?${query}` : ""}`);
    setRows(result.data || []);
  };

  useEffect(() => {
    loadExpenses().catch((e) => setError(e.message));
  }, [filterCategory, filterMonth]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      if (editingId) {
        await put(`/api/expenses/${editingId}`, form);
        setMessage("Expense updated");
      } else {
        await post("/api/expenses", form);
        setMessage("Expense created");
      }
      setForm(initialForm);
      setEditingId("");
      await loadExpenses();
    } catch (e) {
      setError(e.message);
    }
  };

  const onEdit = (row) => {
    setEditingId(row.id);
    setForm({
      amount: row.amount,
      category: row.category,
      description: row.description || "",
      date: row.date,
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await del(`/api/expenses/${id}`);
      setMessage("Expense deleted");
      await loadExpenses();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <AppShell title="Expenses">
      <section className="surface">
        <h3>Add / Edit Expense</h3>
        <form className="form-grid" onSubmit={onSubmit}>
          <div className="field">
            <label>Amount</label>
            <input type="number" min="0.01" step="0.01" required value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} />
          </div>
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Description</label>
            <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="field">
            <label>Date</label>
            <input type="date" required value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
          </div>
          <div className="btn-row">
            <button className="btn btn-primary" type="submit">{editingId ? "Update Expense" : "Save Expense"}</button>
            <button className="btn btn-ghost" type="button" onClick={() => { setEditingId(""); setForm(initialForm); }}>Cancel Edit</button>
          </div>
        </form>
        {message ? <p className="message success">{message}</p> : null}
        {error ? <p className="message error">{error}</p> : null}
      </section>

      <section className="surface mtop">
        <div className="filter-bar">
          <div className="field">
            <label>Filter Category</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Filter Month</label>
            <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td data-label="Date">{row.date}</td>
                  <td data-label="Category">{row.category}</td>
                  <td data-label="Description">{row.description || "-"}</td>
                  <td data-label="Amount">{formatCurrency(row.amount)}</td>
                  <td data-label="Actions">
                    <div className="btn-row">
                      <button className="btn btn-ghost" type="button" onClick={() => onEdit(row)}>Edit</button>
                      <button className="btn btn-danger" type="button" onClick={() => onDelete(row.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}

export default ExpensesPage;
