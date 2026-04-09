import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import { get } from "../services/api";
import { formatCurrency } from "../utils/format";

function TransactionsPage() {
  const [allRows, setAllRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    get("/api/transactions")
      .then((res) => {
        const data = res.data || [];
        setAllRows(data);
        setRows(data);
      })
      .catch((e) => setError(e.message));
  }, []);

  const applyFilters = () => {
    const q = search.trim().toLowerCase();
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;

    const next = allRows.filter((item) => {
      if (type && item.type !== type) return false;
      const date = new Date(item.date);
      if (from && date < from) return false;
      if (to && date > to) return false;
      if (q) {
        const haystack = `${item.description || ""} ${item.source || ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    setRows(next);
    setMessage(`Loaded ${next.length} records`);
  };

  return (
    <AppShell title="Transactions">
      <section className="surface">
        <div className="filter-bar">
          <div className="field">
            <label>Search</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="description/source" />
          </div>
          <div className="field">
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">All</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="field">
            <label>From</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="field">
            <label>To</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <div className="btn-row mbtm">
          <button className="btn btn-primary" type="button" onClick={applyFilters}>
            Apply Filters
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Type</th><th>Category/Source</th><th>Description</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.type}-${row.id}`}>
                  <td data-label="Date">{row.date}</td>
                  <td data-label="Type">{row.type}</td>
                  <td data-label="Category/Source">{row.type === "expense" ? row.category : row.source}</td>
                  <td data-label="Description">{row.type === "expense" ? row.description || "-" : "-"}</td>
                  <td data-label="Amount">{formatCurrency(row.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {message ? <p className="message">{message}</p> : null}
        {error ? <p className="message error">{error}</p> : null}
      </section>
    </AppShell>
  );
}

export default TransactionsPage;
