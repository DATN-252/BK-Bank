-- Active: 1769421385504@@127.0.0.1@5432@bank
INSERT INTO branches (branch_id, name) VALUES (1, 'HCM Main Branch');

SELECT setval(
        'branches_branch_id_seq', (
            SELECT MAX(branch_id)
            FROM branches
        )
    );