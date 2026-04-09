# 💰 Personal Finance Tracker

A robust, full-stack application designed to help you take control of your money. Track expenses, manage budgets, and visualize your financial health in real-time.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-00000f?style=for-the-badge&logo=mysql&logoColor=white)

---

## 🚀 Key Features

* **🔐 Secure Auth:** JWT-based authentication with protected API routes.
* **📊 Dynamic Dashboard:** Real-time data visualization of spending habits.
* **💳 Transaction Management:** Full CRUD for income and expenses.
* **📅 Budgeting:** Set monthly limits and track progress bars.
* **🔍 Advanced Filtering:** Search and filter transactions by date or category.

---

## 🛠️ Setup Instructions

### 1. Clone the Project
```bash
git clone git@github.com:Arpitruh/Finance-Tracker.git
cd Finance-Tracker



2. Prerequisites
Node.js 18+

MySQL 8+

npm 9+

💻 Backend Setup (/backend)
Install Dependencies:
cd backend
npm install

Environment Configuration:
Create a .env file in the backend folder:
PORT=5000
DB_HOST=localhost
DB_USER=finance_user
DB_PASSWORD=finance_pass_123
DB_NAME=finance_tracker
JWT_SECRET=your_super_secret_key_here
FRONTEND_URL=http://localhost:5173

Database Setup:
mysql -u finance_user -p -e "CREATE DATABASE IF NOT EXISTS finance_tracker;"
mysql -u finance_user -p finance_tracker < config/schema.sql

Start the Server:
npm run dev

🎨 Frontend Setup (/frontend)
Install & Launch:
cd frontend
npm install
npm run dev

Access the App:
Open http://localhost:5173 in your browser.


📂 Project Structure
Plaintext
finance-tracker/
 ├── backend/
 │   ├── config/       # Database & Passport configs
 │   ├── controllers/  # Logic for API endpoints
 │   ├── middleware/   # JWT & Auth checks
 │   └── routes/       # API route definitions
 └── frontend/
     ├── src/
     │   ├── components/ # Reusable UI atoms
     │   ├── pages/      # Dashboard, Login, Transactions
     │   └── services/   # Axios API calls


🛠️ Troubleshooting
Issue,Solution
CORS Error,Ensure FRONTEND_URL in backend .env matches your browser URL exactly.
MySQL Denied,Use a dedicated user instead of root to avoid socket authentication issues.
Network Error,Ensure the backend is actually running on port 5000.
