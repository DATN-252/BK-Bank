
export interface PaymentPreviewCreditType {
    recipientAccount: string;
    cardType: string;
    cardNumber: string;
    cvc: string;
    expirationDate: string;
    cardholderName: string;
    billingAddress: string;
    zipCode: string;
    amount: number;
    currency: string;
    cardNetwork?: string;
};

export interface PaymentCreditType {
    merchantId: string;
    cardType: string;
    cardNumber: string;
    cvc: string;
    expirationDate: string;
    amount: number;
    latitude: number | null;
    longitude: number | null;
    idempotencyKey: string;
    // branchId: string;
    // branchName: string;
};

export interface CheckoutDataType {
    approved: boolean;
    responseCode: string;
    paymentId: string;
    authCode: string;
    cardType: string;

    cardNetwork: string;
    maskedPan: string;
    message: string;
    responseMessage: string;
    idempotencyKey: string;

    merchantId: string;
    merchantName: string;
    recipientAccount: string;
    recipientName: string;
    bankName: string;

    amount: number;
    fee: number;
    totalAmount: number;
    currency: string;
    maskedCardNumber: string;
    transactionTime: string;
    transactionId: string;
}