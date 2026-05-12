
export interface TransactionPreviewCreditType {
    recipientAccount: string;
    cardType: string;
    cardNetwork: string;
    cardNumber: string;
    cvc: string;
    expirationDate: string;
    cardholderName: string;
    billingAddress: string;
    zipCode: string;
    amount: number;
    currency: string;

    latitude?: number | null;
    longitude?: number | null;
};

export interface TransactionPreviewCreditResponseType {
    merchantId: string;
    cardType: string;
    amount: number;
    longitude: number;
    latitude: number;

    totalAmount: number;
    zipCode: string;
    fee: number;
    bankName: string;
    maskedCardNumber: string;
    merchantName: string;
    executionTime: string;
    merchantLatitude: number;
    merchantLongitude: number;
    cardNetwork: string;
    recipientAccount: string;
    cardholderName: string;
    merchantAddress: string;
    recipientName: string;
    currency: string;
    billingAddress: string;
    status: "VALID" | "INVALID";
};

export interface TransactionCreditType {
    merchantId: string;
    cardType: string;
    cardNumber: string;
    cvc: string;
    expirationDate: string;
    amount: number;
    latitude: number | null;
    longitude: number | null;
    idempotencyKey: string;

    // paymentNote?: string;
    // branchId?: string;
    // branchName?: string;
};

export interface CheckoutDataType {
    responseMessage: string;
    responseCode: string;

    cardNetwork: string;
    cardType: string;
    latitude: number;
    longitude: number;
    recipientAccount: string;
    recipientName: string;

    merchantAddress: string;
    merchantLatitude: number;
    merchantLongitude: number;
    merchantId: string;
    merchantName: string;

    fee: number;
    amount: number;
    totalAmount: number;
    currency: string;
    maskedCardNumber: string;

    bankName: string;
    transactionId: string;
    idempotencyKey: string;
    paymentId: string;
    transactionTime: string;

    approved: boolean;
};

export interface CheckoutSuccessDataType extends CheckoutDataType {
    authCode: string;

    maskedPan: string;
    accountId: string;
    accountType: string;
    linkedAccountNumber: string;

    paymentNote: string;
    message: string;
};

export interface CheckoutErrorDataType extends CheckoutDataType {
    retryable: boolean;
    errorCode: string;
    errorTitle: string;
    httpStatus: number;
    errorHint: string;
};