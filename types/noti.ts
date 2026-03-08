export interface NotificationType {
    id: string;
    accountId: string;
    accountType: string;
    transactionType: string;
    amount: number;
    transactionDate: string;
    description: string;
    balanceAfter: number;
    merchantId?: string;
    merchantName?: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
}