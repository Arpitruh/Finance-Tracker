import { useEffect, useMemo, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  DoughnutController,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import AppShell from "../components/layout/AppShell";
import { formatCurrency } from "../utils/format";
import { get } from "../services/api";

ChartJS.register(
  ArcElement,
  BarElement,
  DoughnutController,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function getLastSixMonths() {
  const now = new Date();
  return Array.from({ length: 6 }).map((_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
    return d.toISOString().slice(0, 7);
  });
}

function DashboardPage() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const month = getCurrentMonth();
    Promise.all([
      get("/api/income"),
      get("/api/expenses"),
      get(`/api/budget?month=${month}`),
    ])
      .then(([incomeRes, expenseRes, budgetRes]) => {
        setIncome(incomeRes.data || []);
        setExpenses(expenseRes.data || []);
        setBudgets(budgetRes.data || []);
      })
      .catch((err) => setError(err.message));
  }, []);

  const month = getCurrentMonth();
  const incomeThisMonth = income.filter((item) => item.date?.startsWith(month));
  const expensesThisMonth = expenses.filter((item) => item.date?.startsWith(month));
  const totalIncome = incomeThisMonth.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpense = expensesThisMonth.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const spentByCategory = useMemo(
    () =>
      expensesThisMonth.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + Number(item.amount || 0);
        return acc;
      }, {}),
    [expensesThisMonth]
  );

  const pieData = {
    labels: Object.keys(spentByCategory),
    datasets: [
      {
        data: Object.values(spentByCategory),
        backgroundColor: ["#24d84f", "#d1e318", "#5f50bf", "#2ed6c1", "#8ab4f8", "#ff8c42"],
      },
    ],
  };

  const months = getLastSixMonths();
  const incomeByMonth = {};
  const expenseByMonth = {};
  income.forEach((item) => {
    const key = item.date?.slice(0, 7);
    incomeByMonth[key] = (incomeByMonth[key] || 0) + Number(item.amount || 0);
  });
  expenses.forEach((item) => {
    const key = item.date?.slice(0, 7);
    expenseByMonth[key] = (expenseByMonth[key] || 0) + Number(item.amount || 0);
  });

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: months.map((m) => incomeByMonth[m] || 0),
        borderColor: "#24d84f",
        backgroundColor: "#24d84f",
      },
      {
        label: "Expenses",
        data: months.map((m) => expenseByMonth[m] || 0),
        borderColor: "#ff6a6a",
        backgroundColor: "#ff6a6a",
      },
    ],
  };

  const chartBaseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#e7f2ed",
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
  };

  const pieOptions = {
    ...chartBaseOptions,
    plugins: {
      ...chartBaseOptions.plugins,
      legend: {
        ...chartBaseOptions.plugins.legend,
        position: isMobile ? "bottom" : "right",
      },
    },
  };

  const lineOptions = {
    ...chartBaseOptions,
    plugins: {
      ...chartBaseOptions.plugins,
      legend: {
        ...chartBaseOptions.plugins.legend,
        position: "bottom",
      },
    },
    scales: {
      x: { ticks: { color: "#b8cbc3" }, grid: { color: "rgba(184, 203, 195, 0.15)" } },
      y: { ticks: { color: "#b8cbc3" }, grid: { color: "rgba(184, 203, 195, 0.15)" } },
    },
  };

  return (
    <AppShell title="Dashboard">
      <div className="dashboard-compact">
        <section className="cards">
          <article className="card">
            <div className="label">Total Income (This Month)</div>
            <div className="value">{formatCurrency(totalIncome)}</div>
          </article>
          <article className="card">
            <div className="label">Total Expenses (This Month)</div>
            <div className="value">{formatCurrency(totalExpense)}</div>
          </article>
          <article className="card">
            <div className="label">Net Balance</div>
            <div className="value">{formatCurrency(totalIncome - totalExpense)}</div>
          </article>
        </section>

        <section className="surface mtop">
          <h3>Budget Progress</h3>
          {budgets.length === 0 ? (
            <p className="muted">No budgets set for this month.</p>
          ) : (
            budgets.map((budget) => {
              const spent = spentByCategory[budget.category] || 0;
              const limit = Number(budget.monthly_limit || 0);
              const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
              return (
                <div className="progress-row" key={budget.id}>
                  <div>
                    <strong>{budget.category}</strong> - {formatCurrency(spent)} / {formatCurrency(limit)}
                  </div>
                  <progress max="100" value={percent} style={{ width: "100%" }} />
                </div>
              );
            })
          )}
        </section>

        <section className="grid-2 mtop">
          <div className="surface">
            <h3>Expense Breakdown by Category</h3>
            <div className="chart-wrap">
              {pieData.labels.length > 0 ? (
                isMobile ? (
                  <Doughnut data={pieData} options={pieOptions} />
                ) : (
                  <Pie data={pieData} options={pieOptions} />
                )
              ) : (
                <p className="muted">No expense data yet.</p>
              )}
            </div>
          </div>
          <div className="surface">
            <h3>Income vs Expenses (Last 6 Months)</h3>
            <div className="chart-wrap">
              {isMobile ? <Bar data={lineData} options={lineOptions} /> : <Line data={lineData} options={lineOptions} />}
            </div>
          </div>
        </section>
        {error ? <p className="message error">{error}</p> : null}
      </div>
    </AppShell>
  );
}

export default DashboardPage;
