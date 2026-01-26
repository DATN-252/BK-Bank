-- Active: 1769421055658@@127.0.0.1@5432@bank
-- =========================================================
-- PostgreSQL DDL
-- =========================================================

-- DROP DATABASE IF EXISTS bank;
-- CREATE DATABASE bank;

-- =========================
-- BRANCHES
-- =========================
CREATE TABLE IF NOT EXISTS branches (
    branch_id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL
);

-- =========================
-- CUSTOMERS
-- =========================
CREATE TABLE IF NOT EXISTS customers (
    citizen_id VARCHAR(32) PRIMARY KEY,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    phone VARCHAR(30),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('M', 'F', 'O')),
    job VARCHAR(120) NULL,
    home_country VARCHAR(2) NOT NULL DEFAULT 'VN',
    latitude DECIMAL(10, 7) NULL,
    longitude DECIMAL(10, 7) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customer_phone ON customers (phone);

-- =========================
-- ACCOUNTS
-- =========================
CREATE TABLE IF NOT EXISTS accounts (
    account_number VARCHAR(32) PRIMARY KEY,
    balance DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    hold_balance DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    credit_limit DECIMAL(18, 2) NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'VND',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (
        status IN ('ACTIVE', 'BLOCKED')
    ),
    customer_id VARCHAR(32) NOT NULL,
    branch_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_accounts_customer FOREIGN KEY (customer_id) REFERENCES customers (citizen_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_accounts_branch FOREIGN KEY (branch_id) REFERENCES branches (branch_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_account_customer ON accounts (customer_id);

CREATE INDEX IF NOT EXISTS idx_account_branch ON accounts (branch_id);

-- =========================
-- CARDS
-- =========================
CREATE TABLE IF NOT EXISTS cards (
    card_id VARCHAR(36) PRIMARY KEY,
    pan_token VARCHAR(128) NOT NULL UNIQUE,
    last4 VARCHAR(4) NOT NULL,
    exp_month INTEGER NOT NULL,
    exp_year INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (
        status IN ('ACTIVE', 'BLOCKED')
    ),
    card_type VARCHAR(40) NULL, -- 'DEBIT' or 'CREDIT'
    account_id VARCHAR(32) NOT NULL,
    -- Credit Card Specifics
    available_credit DECIMAL(18, 2) NULL,
    current_balance DECIMAL(18, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cards_account FOREIGN KEY (account_id) REFERENCES accounts (account_number) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_card_account ON cards (account_id);

-- =========================
-- MERCHANTS
-- =========================
CREATE TABLE IF NOT EXISTS merchants (
    merchant_id VARCHAR(64) PRIMARY KEY,
    merchant_name VARCHAR(160) NOT NULL,
    category VARCHAR(60) NOT NULL,
    country VARCHAR(2) NOT NULL,
    city_population INTEGER NULL,
    city VARCHAR(120) NULL,
    street VARCHAR(160) NULL,
    state VARCHAR(60) NULL,
    zip VARCHAR(20) NULL,
    merch_long DECIMAL(10, 7) NULL,
    merch_lat DECIMAL(10, 7) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_merchant_country_category ON merchants (country, category);

-- =========================
-- TRANSACTIONS
-- =========================
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id VARCHAR(36) PRIMARY KEY,
    idempotency_key VARCHAR(80) NOT NULL UNIQUE,
    channel VARCHAR(20) NOT NULL CHECK (
        channel IN ('CARD_PAYMENT', 'TRANSFER')
    ),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (
        status IN (
            'PENDING',
            'APPROVED',
            'DECLINED',
            'SUCCESS',
            'FAILED',
            'REFUNDED'
        )
    ),
    amount DECIMAL(18, 2) NOT NULL,
    trans_date DATE NULL,
    trans_time TIMESTAMP NOT NULL,
    unix_time BIGINT NULL,
    trans_num VARCHAR(64) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Card Payment Fields
    merchant_id VARCHAR(64) NULL,
    card_id VARCHAR(36) NULL,
    card_type VARCHAR(20) DEFAULT 'DEBIT' CHECK (
        card_type IN ('DEBIT', 'CREDIT')
    ),
    is_credited_payment BOOLEAN DEFAULT FALSE,
    -- Fraud Output
    risk_score DOUBLE PRECISION NULL,
    fraud_decision VARCHAR(20) NULL CHECK (
        fraud_decision IN ('PASS', 'REJECT', 'REVIEW')
    ),
    model_version VARCHAR(40) NULL,
    reason_code VARCHAR(80) NULL,
    CONSTRAINT fk_transactions_merchant FOREIGN KEY (merchant_id) REFERENCES merchants (merchant_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_transactions_card FOREIGN KEY (card_id) REFERENCES cards (card_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tx_channel_time ON transactions (channel, trans_time);

CREATE INDEX IF NOT EXISTS idx_tx_card_time ON transactions (card_id, trans_time);

CREATE INDEX IF NOT EXISTS idx_tx_merchant_time ON transactions (merchant_id, trans_time);

-- =========================
-- ACCOUNT_TRANSACTIONS
-- =========================
CREATE TABLE IF NOT EXISTS account_transactions (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(36) NOT NULL UNIQUE,
    account_number_send VARCHAR(32) NOT NULL,
    account_number_receive VARCHAR(32) NULL,
    to_bank_id VARCHAR(20) NULL,
    to_account_no_external VARCHAR(32) NULL,
    CONSTRAINT fk_account_trans_tx FOREIGN KEY (transaction_id) REFERENCES transactions (transaction_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_account_trans_send FOREIGN KEY (account_number_send) REFERENCES accounts (account_number) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_account_trans_receive FOREIGN KEY (account_number_receive) REFERENCES accounts (account_number) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_acctrans_send ON account_transactions (account_number_send);

CREATE INDEX IF NOT EXISTS idx_acctrans_receive ON account_transactions (account_number_receive);

-- =========================
-- LEDGER ENTRIES
-- =========================
CREATE TABLE IF NOT EXISTS ledger_entries (
    entry_id VARCHAR(36) PRIMARY KEY,
    account_id VARCHAR(32) NOT NULL,
    ref_type VARCHAR(20) NOT NULL CHECK (
        ref_type IN ('CARD_TX', 'TRANSFER')
    ),
    ref_id VARCHAR(36) NOT NULL,
    entry_type VARCHAR(20) NOT NULL CHECK (
        entry_type IN (
            'HOLD',
            'RELEASE_HOLD',
            'DEBIT',
            'CREDIT'
        )
    ),
    amount DECIMAL(18, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ledger_entries_account FOREIGN KEY (account_id) REFERENCES accounts (account_number) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_ledger_account_time ON ledger_entries (account_id, created_at);

CREATE INDEX IF NOT EXISTS idx_ledger_ref ON ledger_entries (ref_type, ref_id);

-- =========================
-- CREDIT CARD BILLS
-- =========================
CREATE TABLE IF NOT EXISTS credit_card_bills (
    bill_id VARCHAR(36) PRIMARY KEY,
    card_id VARCHAR(36) NOT NULL,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    minimum_payment DECIMAL(18, 2) NOT NULL,
    paid_amount DECIMAL(18, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (
        status IN ('PENDING', 'PAID', 'OVERDUE')
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bill_card FOREIGN KEY (card_id) REFERENCES cards (card_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_bill_card ON credit_card_bills (card_id);

CREATE INDEX IF NOT EXISTS idx_bill_status ON credit_card_bills (status);

CREATE INDEX IF NOT EXISTS idx_bill_due_date ON credit_card_bills (due_date);

-- =========================
-- CREDIT CARD PAYMENTS
-- =========================
CREATE TABLE IF NOT EXISTS credit_card_payments (
    payment_id VARCHAR(36) PRIMARY KEY,
    bill_id VARCHAR(36) NOT NULL,
    transaction_id VARCHAR(36) NULL,
    amount DECIMAL(18, 2) NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (
        status IN (
            'SUCCESS',
            'FAILED',
            'PENDING'
        )
    ),
    description VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_bill FOREIGN KEY (bill_id) REFERENCES credit_card_bills (bill_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_payment_transaction FOREIGN KEY (transaction_id) REFERENCES transactions (transaction_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_bill ON credit_card_payments (bill_id);

CREATE INDEX IF NOT EXISTS idx_payment_status ON credit_card_payments (status);

CREATE INDEX IF NOT EXISTS idx_payment_transaction ON credit_card_payments (transaction_id);