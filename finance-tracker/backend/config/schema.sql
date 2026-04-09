CREATE DATABASE IF NOT EXISTS finance_tracker;
USE finance_tracker;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category ENUM(
    'groceries',
    'utilities',
    'entertainment',
    'dining',
    'transport',
    'clothing',
    'health',
    'other'
  ) NOT NULL,
  description VARCHAR(255) NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_expenses_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS income (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  source VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  frequency ENUM('one-time', 'weekly', 'monthly') NOT NULL,
  date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_income_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS budgets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category ENUM(
    'groceries',
    'utilities',
    'entertainment',
    'dining',
    'transport',
    'clothing',
    'health',
    'other'
  ) NOT NULL,
  monthly_limit DECIMAL(10, 2) NOT NULL,
  month VARCHAR(7) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_budgets_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);
