
interface CardType {
    id: string;
    maskedPan: string;
    expirationDate: string;
    cardholderName: string;
    bank: string;
    accountId: string;
    status: string;
    lastFour: string;
    cardType: string;
    network: string;
    outstandingBalance: number;
};

export interface DebitCardType extends CardType {
    balance: number;
    // pinOTP: string;
};

export interface CreditCardType extends CardType {
    creditLimit: number;
};