
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