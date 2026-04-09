const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const expensesRoutes = require("./routes/expenses");
const incomeRoutes = require("./routes/income");
const budgetRoutes = require("./routes/budget");
const transactionsRoutes = require("./routes/transactions");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [process.env.FRONTEND_URL].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow tools like Postman/curl with no browser origin.
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/$/, "");
      const isLocalhost =
        /^http:\/\/localhost(:\d+)?$/.test(normalizedOrigin) ||
        /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(normalizedOrigin);
      if (isLocalhost) return callback(null, true);
      if (allowedOrigins.includes(normalizedOrigin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/transactions", transactionsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
