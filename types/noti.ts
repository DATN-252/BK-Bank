export interface NotificationType {
    id: string;
    accountNumber: string;
    accountType: string;
    transactionType: string;
    amount: number;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';

    originalTransactionId: string;
    channel: "ONLINE";
    transactionDate: string;
    description: string;
    balanceAfter: number;
    merchantId: string;
    merchantName: string;
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
};