import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import { del, get, post, put } from "../services/api";
import { formatCurrency } from "../utils/format";

const initialForm = {
  source: "",
  amount: "",
  frequency: "one-time",
  date: "",
  is_recurring: false,
};

function IncomePage() {
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadIncome = async () => {
    const result = await get("/api/income");
    setRows(result.data || []);
  };

  useEffect(() => {
    loadIncome().catch((e) => setError(e.message));
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      if (editingId) {
        await put(`/api/income/${editingId}`, form);
        setMessage("Income updated");
      } else {
        await post("/api/income", form);
        setMessage("Income created");
      }
      setEditingId("");
      setForm(initialForm);
      await loadIncome();
    } catch (e) {
      setError(e.message);
    }
  };

  const onEdit = (row) => {
    setEditingId(row.id);
    setForm({
      source: row.source,
      amount: row.amount,
      frequency: row.frequency,
      date: row.date,
      is_recurring: Boolean(row.is_recurring),
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this income entry?")) return;
    try {
      await del(`/api/income/${id}`);
      setMessage("Income deleted");
      await loadIncome();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <AppShell title="Income">
      <section className="surface">
        <h3>Add / Edit Income</h3>
        <form className="form-grid" onSubmit={onSubmit}>
          <div className="field">
            <label>Source</label>
            <input required value={form.source} onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))} />
          </div>
          <div className="field">
            <label>Amount</label>
            <input type="number" min="0.01" step="0.01" required value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} />
          </div>
          <div className="field">
            <label>Frequency</label>
            <select value={form.frequency} onChange={(e) => setForm((p) => ({ ...p, frequency: e.target.value }))}>
              <option value="one-time">One-time</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="field">
            <label>Date</label>
            <input type="date" required value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
          </div>
          <div className="field">
            <label>
              <input type="checkbox" checked={form.is_recurring} onChange={(e) => setForm((p) => ({ ...p, is_recurring: e.target.checked }))} />
              {" "}Is Recurring
            </label>
          </div>
          <div className="btn-row">
            <button className="btn btn-primary" type="submit">{editingId ? "Update Income" : "Save Income"}</button>
            <button className="btn btn-ghost" type="button" onClick={() => { setEditingId(""); setForm(initialForm); }}>Cancel Edit</button>
          </div>
        </form>
        {message ? <p className="message success">{message}</p> : null}
        {error ? <p className="message error">{error}</p> : null}
      </section>

      <section className="surface mtop">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Source</th><th>Frequency</th><th>Recurring</th><th>Amount</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td data-label="Date">{row.date}</td>
                  <td data-label="Source">{row.source}</td>
                  <td data-label="Frequency">{row.frequency}</td>
                  <td data-label="Recurring">{row.is_recurring ? "Yes" : "No"}</td>
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

export default IncomePage;
