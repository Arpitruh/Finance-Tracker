💰 Personal Finance TrackerA robust, full-stack application designed to help you take control of your money. Track expenses, manage budgets, and visualize your financial health in real-time.🚀 Key Features🔐 Secure Auth: JWT-based authentication with protected API routes.📊 Dynamic Dashboard: Real-time data visualization of spending habits.💳 Transaction Management: Full CRUD for income and expenses.📅 Budgeting: Set monthly limits and track progress bars.🔍 Advanced Filtering: Search and filter transactions by date or category.🛠️ Setup Instructions1. Clone the ProjectBashgit clone git@github.com:Arpitruh/Finance-Tracker.git
cd Finance-Tracker
2. PrerequisitesNode.js 18+MySQL 8+npm 9+💻 Backend Setup (/backend)Install Dependencies:Bashcd backend
npm install
Environment Configuration:Create a .env file in the backend folder:Code snippetPORT=5000
DB_HOST=localhost
DB_USER=finance_user
DB_PASSWORD=finance_pass_123
DB_NAME=finance_tracker
JWT_SECRET=your_super_secret_key_here
FRONTEND_URL=http://localhost:5173
Database Setup:If you haven't created the user yet, run this in your MySQL shell:SQLCREATE USER 'finance_user'@'localhost' IDENTIFIED BY 'finance_pass_123';
GRANT ALL PRIVILEGES ON finance_tracker.* TO 'finance_user'@'localhost';
FLUSH PRIVILEGES;
Then import the schema:Bashmysql -u finance_user -p -e "CREATE DATABASE IF NOT EXISTS finance_tracker;"
mysql -u finance_user -p finance_tracker < config/schema.sql
Start the Engine:Bashnpm run dev
Health Check: GET http://localhost:5000/api/health🎨 Frontend Setup (/frontend)Install & Launch:Bashcd frontend
npm install
npm run dev
Access the App:Open http://localhost:5173 in your browser.📂 Project StructurePlaintext finance-tracker/
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
🛠️ TroubleshootingIssueSolutionCORS ErrorEnsure FRONTEND_URL in backend .env matches your browser URL exactly.MySQL DeniedUse a dedicated user instead of root to avoid socket authentication issues.Network ErrorEnsure the backend is actually running on port 5000.
