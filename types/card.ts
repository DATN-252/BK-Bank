
interface CardType {
    maskedPan: string;
    expirationDate: string;
    cardholderName: string;
    bank: string;
    accountId: string;
    status: string;
    lastFour: string;
    cardType: string;
};

export interface DebitCardType extends CardType {
    balance: number;
    // pinOTP: string;
};

export interface CreditCardType extends CardType {
    creditLimit: number;
    outstandingBalance: number;
};