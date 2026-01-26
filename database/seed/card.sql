-- Active: 1769421385504@@127.0.0.1@5432@bank
INSERT INTO
    cards (
        card_id,
        pan_token,
        last4,
        exp_month,
        exp_year,
        status,
        card_type,
        account_id,
        available_credit,
        current_balance
    )
VALUES (
        '11111111-1111-1111-1111-111111111111',
        'PAN_TOKEN_001',
        '1234',
        12,
        2028,
        'ACTIVE',
        'DEBIT',
        'ACC001',
        NULL,
        0
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'PAN_TOKEN_CREDIT',
        '5678',
        12,
        2028,
        'ACTIVE',
        'CREDIT',
        'ACC_CREDIT_01',
        10000000,
        0
    );