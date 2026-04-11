
export interface termStatementType {
    statementId: number,
    accountNumber: string,
    statementPeriodStart: string,
    statementPeriodEnd: string,
    billingDate: string,
    dueDate: string,
    previousBalance: number,
    totalCharges: number,
    totalPayments: number,
    minimumDue: number,
    newBalance: number,
    availableCredit: number,
    transactionCount: number,
    statementStatus: "PAID" | "UNPAID" | "OVERDUE",
    paidAmountAfterStatement: number,
    remainingMinimumDue: number,
    remainingBalance: number,
    lastPaymentDate: string,
    generatedAt: string
};

export interface statementDetailType extends termStatementType {
    currency: string,
    items: [
        transactionStatementType
    ]
};

export interface transactionStatementType {
    transactionDate: string,
    paymentId: string,
    transactionType: "CHARGE" | "PAYMENT" | "REFUND" | "REVERSAL",
    merchantId: string,
    merchantName: string,
    amount: number,
    balanceAfter: number,
    status: "SUCCESS" | "PENDING" | "FAILED",
    responseCode: string,
    responseMessage: string
};

export interface paymentCreditResponseType {
    loanId: string;
    billingDate: string;
    paymentOption: "MINIMUM_DUE" | "STATEMENT_BALANCE" | "CUSTOM";
    paymentSource: "INTERNAL_SAVINGS" | "EXTERNAL_CARD";
    sourceAccountNumber: string;
    paymentAmount: number;
    currency: string;
    statementStatusBefore: "OPEN"| "CLOSED";
    statementStatusAfter: "OPEN" | "CLOSED";
    remainingMinimumDueBefore: number;
    remainingMinimumDueAfter: number;
    remainingBalanceBefore: number;
    remainingBalanceAfter: number;
    sourceAccountBalanceAfter: number;
    paymentId: string;
    paidAt: string;
    note: string;
};