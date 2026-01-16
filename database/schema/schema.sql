-- Active: 1768540048974@@127.0.0.1@3306@bank
-- =========================================================
-- MySQL DDL
-- =========================================================
DROP DATABASE IF EXISTS bank;

CREATE DATABASE IF NOT EXISTS bank;

USE bank;

SET NAMES utf8mb4;

SET time_zone = '+00:00';

-- =========================
-- BRANCHES
-- =========================
CREATE TABLE branches (
    branch_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- =========================
-- CUSTOMERS
-- =========================
CREATE TABLE customers (
    citizen_id VARCHAR(32) PRIMARY KEY,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    phone VARCHAR(30),
    date_of_birth DATE,
    gender ENUM('M', 'F', 'O') NULL,
    job VARCHAR(120) NULL,
    home_country VARCHAR(2) NOT NULL DEFAULT 'VN',
    latitude DECIMAL(10, 7) NULL,
    longitude DECIMAL(10, 7) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_customer_phone ON customers (phone);

-- =========================
-- ACCOUNTS
-- =========================
CREATE TABLE accounts (
    account_number VARCHAR(32) PRIMARY KEY,
    balance DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    hold_balance DECIMAL(18, 2) NOT NULL DEFAULT 0.00, -- for transfer hold/saga 
    currency VARCHAR(3) NOT NULL DEFAULT 'VND',
    status ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',
    customer_id VARCHAR(32) NOT NULL,
    branch_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_accounts_customer FOREIGN KEY (customer_id) REFERENCES customers (citizen_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_accounts_branch FOREIGN KEY (branch_id) REFERENCES branches (branch_id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_account_customer ON accounts (customer_id);

CREATE INDEX idx_account_branch ON accounts (branch_id);

-- =========================
-- CARDS
-- =========================
CREATE TABLE cards (
    card_id VARCHAR(36) PRIMARY KEY, -- UUID
    pan_token VARCHAR(128) NOT NULL UNIQUE, -- token or hash
    last4 VARCHAR(4) NOT NULL,
    exp_month INT NOT NULL,
    exp_year INT NOT NULL,
    status ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',
    card_type VARCHAR(40) NULL,
    account_id VARCHAR(32) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cards_account FOREIGN KEY (account_id) REFERENCES accounts (account_number) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_card_account ON cards (account_id);

-- =========================
-- MERCHANTS
-- =========================
CREATE TABLE merchants (
    merchant_id VARCHAR(64) PRIMARY KEY,
    merchant_name VARCHAR(160) NOT NULL,
    category VARCHAR(60) NOT NULL,
    country VARCHAR(2) NOT NULL,
    city_population INT NULL,
    city VARCHAR(120) NULL,
    street VARCHAR(160) NULL,
    state VARCHAR(60) NULL,
    zip VARCHAR(20) NULL,
    merch_long DECIMAL(10, 7) NULL,
    merch_lat DECIMAL(10, 7) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_merchant_country_category ON merchants (country, category);

-- =========================
-- TRANSACTIONS (unified for CARD_PAYMENT and TRANSFER)
-- =========================

CREATE TABLE transactions (
    transaction_id VARCHAR(36) PRIMARY KEY, -- UUID 
    idempotency_key VARCHAR(80) NOT NULL UNIQUE,
    channel ENUM('CARD_PAYMENT', 'TRANSFER') NOT NULL,
    status ENUM(
        'PENDING',
        'APPROVED',
        'DECLINED',
        'SUCCESS',
        'FAILED',
        'REFUNDED'
    ) NOT NULL DEFAULT 'PENDING',
    amount DECIMAL(18, 2) NOT NULL,
    trans_time TIMESTAMP NOT NULL, -- use one time field
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- card payment fields (nullable for transfer)
    merchant_id VARCHAR(64) NULL,
    card_id VARCHAR(36) NULL,
    -- fraud output
    risk_score DOUBLE NULL,
    fraud_decision ENUM('PASS', 'REJECT', 'REVIEW') NULL,
    model_version VARCHAR(40) NULL,
    reason_code VARCHAR(80) NULL,
    CONSTRAINT fk_transactions_merchant FOREIGN KEY (merchant_id) REFERENCES merchants (merchant_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_transactions_card FOREIGN KEY (card_id) REFERENCES cards (card_id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_tx_channel_time ON transactions (channel, trans_time);

CREATE INDEX idx_tx_card_time ON transactions (card_id, trans_time);

CREATE INDEX idx_tx_merchant_time ON transactions (merchant_id, trans_time);

-- =========================
-- ACCOUNT_TRANSACTIONS (maps transaction to sender/receiver accounts)
-- - For CARD_PAYMENT: receiver can be NULL (or merchant settlement account if you simulate)
-- - For TRANSFER internal: both send & receive in same DB
-- - For TRANSFER interbank: receive is NULL, use to_bank_id + to_account_no_external
-- =========================

CREATE TABLE account_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    transaction_id VARCHAR(36) NOT NULL UNIQUE,
    account_number_send VARCHAR(32) NOT NULL,
    account_number_receive VARCHAR(32) NULL,
    -- for interbank transfer
    to_bank_id VARCHAR(20) NULL,
    to_account_no_external VARCHAR(32) NULL,
    CONSTRAINT fk_account_trans_tx FOREIGN KEY (transaction_id) REFERENCES transactions (transaction_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_account_trans_send FOREIGN KEY (account_number_send) REFERENCES accounts (account_number) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_account_trans_receive FOREIGN KEY (account_number_receive) REFERENCES accounts (account_number) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_acctrans_send ON account_transactions (account_number_send);

CREATE INDEX idx_acctrans_receive ON account_transactions (account_number_receive);

-- =========================================================
-- Optional: a simple ledger table (nice for "banking correctness")
-- =========================================================
CREATE TABLE ledger_entries (
    entry_id VARCHAR(36) PRIMARY KEY,
    account_id VARCHAR(32) NOT NULL,
    ref_type ENUM('CARD_TX', 'TRANSFER') NOT NULL,
    ref_id VARCHAR(36) NOT NULL,
    entry_type ENUM(
        'HOLD',
        'RELEASE_HOLD',
        'DEBIT',
        'CREDIT'
    ) NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ledger_entries_account FOREIGN KEY (account_id) REFERENCES accounts (account_number) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_ledger_account_time ON ledger_entries (account_id, created_at);

CREATE INDEX idx_ledger_ref ON ledger_entries (ref_type, ref_id);