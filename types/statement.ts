
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
    currentMinimumDue: number,
    pastDueMinimum: number,
    totalMinimumDueNow: number,
    newBalance: number,
    gracePeriodEligible: boolean,
    interestRateAnnual: number,
    interestCharged: number,
    interestAppliedAt: string,
    lateFeeRate: number,
    lateFeeFixed: number,
    lateFeeCharged: number,
    lateFeeAppliedAt: string,
    availableCredit: number,
    transactionCount: number,
    statementStatus: "PAID" | "UNPAID" | "OVERDUE" | "PARTIALLY_PAID",
    paidAmountAfterStatement: number,
    remainingMinimumDue: number,
    remainingBalance: number,
    lastPaymentDate: string,
    generatedAt: string
};

export interface statementDetailType extends termStatementType {
    currency: string,
    statementPeriod: string,
    creditLimit: number,
    remainingCurrentMinimumDue: number,
    remainingPastDueMinimum: number,
    billingDayOfMonth: number,
    paymentDueDays: number,
    minimumPaymentRate: number,
    minimumPaymentFloor: number,
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