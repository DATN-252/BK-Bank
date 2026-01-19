-- =========================================================
-- TRANSACTIONS SEED DATA
-- =========================================================

-- Transaction 1: Successful card payment
INSERT INTO
    transactions (
        transaction_id,
        idempotency_key,
        channel,
        status,
        amount,
        trans_date,
        trans_time,
        unix_time,
        trans_num,
        merchant_id,
        card_id,
        risk_score,
        fraud_decision,
        model_version,
        reason_code,
        created_at
    )
VALUES (
        'TXN-001-UUID-001',
        'IDEMPOTENCY-001',
        'CARD_PAYMENT',
        'SUCCESS',
        150000.00,
        '2026-01-19',
        '2026-01-19 10:30:00+00:00',
        1737275400,
        'TXN-1737275400-a1b2c3d4',
        'VN_STORE',
        '11111111-1111-1111-1111-111111111111',
        0.15,
        'PASS',
        'v1.0.0',
        NULL,
        CURRENT_TIMESTAMP
    );

-- Transaction 2: Suspicious transaction (under review)
INSERT INTO
    transactions (
        transaction_id,
        idempotency_key,
        channel,
        status,
        amount,
        trans_date,
        trans_time,
        unix_time,
        trans_num,
        merchant_id,
        card_id,
        risk_score,
        fraud_decision,
        model_version,
        reason_code,
        created_at
    )
VALUES (
        'TXN-002-UUID-002',
        'IDEMPOTENCY-002',
        'CARD_PAYMENT',
        'SUCCESS',
        5000000.00,
        '2026-01-19',
        '2026-01-19 11:45:00+00:00',
        1737280500,
        'TXN-1737280500-b2c3d4e5',
        'US_STORE',
        '11111111-1111-1111-1111-111111111111',
        0.65,
        'REVIEW',
        'v1.0.0',
        'UNUSUAL_AMOUNT',
        CURRENT_TIMESTAMP
    );

-- Transaction 3: Fraudulent transaction
INSERT INTO
    transactions (
        transaction_id,
        idempotency_key,
        channel,
        status,
        amount,
        trans_date,
        trans_time,
        unix_time,
        trans_num,
        merchant_id,
        card_id,
        risk_score,
        fraud_decision,
        model_version,
        reason_code,
        created_at
    )
VALUES (
        'TXN-003-UUID-003',
        'IDEMPOTENCY-003',
        'CARD_PAYMENT',
        'DECLINED',
        10000000.00,
        '2026-01-19',
        '2026-01-19 14:20:00+00:00',
        1737291600,
        'TXN-1737291600-c3d4e5f6',
        'VN_STORE',
        '11111111-1111-1111-1111-111111111111',
        0.92,
        'REJECT',
        'v1.0.0',
        'EXCESSIVE_AMOUNT_VELOCITY',
        CURRENT_TIMESTAMP
    );

-- Transaction 4: Small safe transaction
INSERT INTO
    transactions (
        transaction_id,
        idempotency_key,
        channel,
        status,
        amount,
        trans_date,
        trans_time,
        unix_time,
        trans_num,
        merchant_id,
        card_id,
        risk_score,
        fraud_decision,
        model_version,
        reason_code,
        created_at
    )
VALUES (
        'TXN-004-UUID-004',
        'IDEMPOTENCY-004',
        'CARD_PAYMENT',
        'SUCCESS',
        50000.00,
        '2026-01-19',
        '2026-01-19 15:10:00+00:00',
        1737295800,
        'TXN-1737295800-d4e5f6g7',
        'US_STORE',
        '11111111-1111-1111-1111-111111111111',
        0.05,
        'PASS',
        'v1.0.0',
        NULL,
        CURRENT_TIMESTAMP
    );

-- Transaction 5: Medium risk transaction
INSERT INTO
    transactions (
        transaction_id,
        idempotency_key,
        channel,
        status,
        amount,
        trans_date,
        trans_time,
        unix_time,
        trans_num,
        merchant_id,
        card_id,
        risk_score,
        fraud_decision,
        model_version,
        reason_code,
        created_at
    )
VALUES (
        'TXN-005-UUID-005',
        'IDEMPOTENCY-005',
        'CARD_PAYMENT',
        'SUCCESS',
        2500000.00,
        '2026-01-19',
        '2026-01-19 16:30:00+00:00',
        1737300600,
        'TXN-1737300600-e5f6g7h8',
        'VN_STORE',
        '11111111-1111-1111-1111-111111111111',
        0.45,
        'REVIEW',
        'v1.0.0',
        'GEOGRAPHIC_MISMATCH',
        CURRENT_TIMESTAMP
    );