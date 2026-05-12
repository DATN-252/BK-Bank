
export interface CardType extends DebitCardType, CreditCardType {
    id: string;
    maskedPan: string;
    network: string;
    lastFour: string;
    outstandingBalance: number;
    expirationDate: string;
    cardType: string;
    accountId: string;
    cardholderName: string;

    linkedAccountNumber: string;
    status: string;
    currency: string;
    accountStatus: string;
    // bank: string;
};

interface DebitCardType {
    balance: number;
    // pinOTP: string;
};

interface CreditCardType {
    creditLimit: number;
    availableCredit: number;
};