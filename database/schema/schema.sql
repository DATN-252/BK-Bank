-- Active: 1768540048974@@127.0.0.1@3306@bank
-- =========================================================
-- MySQL DDL
-- =========================================================

SET NAMES utf8mb4;

SET time_zone = '+00:00';

-- =========================
-- BRANCH
-- =========================
CREATE TABLE branch (
    branch_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- =========================
-- CUSTOMER
-- =========================
CREATE TABLE customer (
    citizen_id VARCHAR(32) PRIMARY KEY,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    phone VARCHAR(30),
    date_of_birth DATE,
    gender ENUM('M', 'F', 'O') NULL,
    job VARCHAR(120) NULL,
    home_country CHAR(2) NOT NULL DEFAULT 'VN',
    latitude DECIMAL(10, 7) NULL,
    longitude DECIMAL(10, 7) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_customer_phone ON customer (phone);

-- =========================
-- ACCOUNT
-- =========================
CREATE TABLE account (
    account_number VARCHAR(32) PRIMARY KEY,
    balance DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    hold_balance DECIMAL(18, 2) NOT NULL DEFAULT 0.00, -- for transfer hold/saga 
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    status ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',
    customer_id VARCHAR(32) NOT NULL,
    branch_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_account_customer FOREIGN KEY (customer_id) REFERENCES customer (citizen_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_account_branch FOREIGN KEY (branch_id) REFERENCES branch (branch_id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_account_customer ON account (customer_id);

CREATE INDEX idx_account_branch ON account (branch_id);

-- =========================
-- CARD
-- =========================
CREATE TABLE card (
    card_id CHAR(36) PRIMARY KEY, -- UUID
    pan_token VARCHAR(128) NOT NULL UNIQUE, -- token or hash
    last4 CHAR(4) NOT NULL,
    exp_month TINYINT NOT NULL,
    exp_year SMALLINT NOT NULL,
    status ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',
    card_type VARCHAR(40) NULL,
    account_id VARCHAR(32) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_card_account FOREIGN KEY (account_id) REFERENCES account (account_number) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_card_account ON card (account_id);

-- =========================
-- MERCHANT
-- =========================
CREATE TABLE merchant (
    merchant_id VARCHAR(64) PRIMARY KEY,
    merchant_name VARCHAR(160) NOT NULL,
    category VARCHAR(60) NOT NULL,
    country CHAR(2) NOT NULL,
    city_population INT NULL,
    city VARCHAR(120) NULL,
    street VARCHAR(160) NULL,
    state VARCHAR(60) NULL,
    zip VARCHAR(20) NULL,
    merch_long DECIMAL(10, 7) NULL,
    merch_lat DECIMAL(10, 7) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_merchant_country_category ON merchant (country, category);

-- =========================
-- TRANSACTION (unified for CARD_PAYMENT and TRANSFER)
-- =========================

CREATE TABLE transaction (
    transaction_id CHAR(36) PRIMARY KEY, -- UUID 
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
    card_id CHAR(36) NULL,
    -- fraud output
    risk_score DOUBLE NULL,
    fraud_decision ENUM('PASS', 'REJECT', 'REVIEW') NULL,
    model_version VARCHAR(40) NULL,
    reason_code VARCHAR(80) NULL,
    CONSTRAINT fk_tx_merchant FOREIGN KEY (merchant_id) REFERENCES merchant (merchant_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_tx_card FOREIGN KEY (card_id) REFERENCES card (card_id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_tx_channel_time ON transaction (channel, trans_time);

CREATE INDEX idx_tx_card_time ON transaction (card_id, trans_time);

CREATE INDEX idx_tx_merchant_time ON transaction (merchant_id, trans_time);

-- =========================
-- ACC_TRANS (maps transaction to sender/receiver accounts)
-- - For CARD_PAYMENT: receiver can be NULL (or merchant settlement account if you simulate)
-- - For TRANSFER internal: both send & receive in same DB
-- - For TRANSFER interbank: receive is NULL, use to_bank_id + to_account_no_external
-- =========================

CREATE TABLE acc_trans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    transaction_id CHAR(36) NOT NULL UNIQUE,
    account_number_send VARCHAR(32) NOT NULL,
    account_number_receive VARCHAR(32) NULL,
    -- for interbank transfer
    to_bank_id VARCHAR(20) NULL,
    to_account_no_external VARCHAR(32) NULL,
    CONSTRAINT fk_acctrans_tx FOREIGN KEY (transaction_id) REFERENCES transaction (transaction_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_acctrans_send FOREIGN KEY (account_number_send) REFERENCES account (account_number) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_acctrans_receive FOREIGN KEY (account_number_receive) REFERENCES account (account_number) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_acctrans_send ON acc_trans (account_number_send);

CREATE INDEX idx_acctrans_receive ON acc_trans (account_number_receive);

-- =========================================================
-- Optional: a simple ledger table (nice for "banking correctness")
-- =========================================================
CREATE TABLE ledger_entry (
    entry_id CHAR(36) PRIMARY KEY,
    account_id VARCHAR(32) NOT NULL,
    ref_type ENUM('CARD_TX', 'TRANSFER') NOT NULL,
    ref_id CHAR(36) NOT NULL,
    entry_type ENUM(
        'HOLD',
        'RELEASE_HOLD',
        'DEBIT',
        'CREDIT'
    ) NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ledger_account FOREIGN KEY (account_id) REFERENCES account (account_number) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_ledger_account_time ON ledger_entry (account_id, created_at);

CREATE INDEX idx_ledger_ref ON ledger_entry (ref_type, ref_id);