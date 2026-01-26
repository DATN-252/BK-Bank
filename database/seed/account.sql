-- Active: 1769421385504@@127.0.0.1@5432@bank
INSERT INTO
    accounts (
        account_number,
        balance,
        hold_balance,
        credit_limit,
        currency,
        status,
        customer_id,
        branch_id
    )
VALUES (
        'ACC001',
        5000000,
        0,
        NULL,
        'VND',
        'ACTIVE',
        '0123456789',
        1
    ),
    (
        'ACC_CREDIT_01',
        0,
        0,
        10000000, -- 10 trieu han muc
        'VND',
        'ACTIVE',
        '0123456789',
        1
    );