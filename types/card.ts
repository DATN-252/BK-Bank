
interface CardType {
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

export interface DebitCardType extends CardType {
    balance: number;
    // pinOTP: string;
};

export interface CreditCardType extends CardType {
    creditLimit: number;
    availableCredit: number;
};