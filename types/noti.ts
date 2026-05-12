export interface NotificationBalanceType {
    id: string;
    accountNumber: string;
    accountType: string;
    transactionType: string;
    amount: number;
    currency: string;
    paymentId: string;
    idempotencyKey: string;

    originalTransactionId: string;
    channel: "ONLINE";
    transactionDate: string;
    description: string;
    balanceAfter: number;
    merchantId: string;
    merchantName: string;
    branchId: string;
    branchName: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
    cardNetwork: string;
    authCode: string;
    stan: string;
    rrn: string;
    externalReference: string;
    responseCode: string;
    responseMessage: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
};

export interface NotificationSystemType {
    id: string;
    paymentId: string;
    cardId: number;
    maskedPan: string;
    accountId: string;
    accountType: string;
    merchantId: string;
    merchantName: string;
    amount: number;
    currency: string;
    transactionTime: string;
    riskScore: number;
    riskLevel: "HIGH" | "MEDIUM" | "LOW";
    fraudPrediction: "FRAUD" | "NORMAL" | "UNKNOWN";
    fraudReason: string;
    status: "OPEN" | "WAITING_CUSTOMER_CONFIRMATION" |
    "CONFIRMED_BY_CUSTOMER" | "REJECTED_BY_CUSTOMER" |
    "CARD_LOCKED" | "RESOLVED" | "FALSE_POSITIVE";
    customerResponse: "CONFIRMED" | "REJECTED" | "NO_RESPONSE";
    notificationSent: boolean;
    notifiedAt: string;
    customerRespondedAt: string;
    cardLockedAt: string | null;
    resolvedAt: string;
    createdAt: string;
    updatedAt: string;
    resolvedBy: string;
    adminNote: string;
    currentCardStatus: "ACTIVE" | "LOCKED";
};