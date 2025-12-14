---- TABLES
--- DROP TABLES
DROP TABLE IF EXISTS recurring_transactions;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

--- CREATE TABLES
-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) UNIQUE NOT NULL,
    balance NUMERIC(10, 2) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    category_type VARCHAR(100) NOT NULL,

    CHECK (
        (category_type = 'INCOME' AND category_name IN ('SALARY', 'OTHER_INCOME'))
        OR
        (category_type = 'EXPENSE' AND category_name NOT IN ('SALARY', 'OTHER_INCOME'))
    )
);

-- TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL,
    name VARCHAR(150),
    amount NUMERIC(10, 2) NOT NULL,
    datetime TIMESTAMP NOT NULL,
    payment_mode VARCHAR(50) DEFAULT 'UPI',
    note VARCHAR(255)
);

-- RECURRING TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS recurring_transactions (
    recurring_transaction_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL,
    recurring_transaction_name VARCHAR(150) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    next_run_date DATE NOT NULL
);
