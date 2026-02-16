interface CardType {
    numCard: string;
    dateCard: string;
    amount: number;
    cardholderName: string;
}

export interface DebitCardType extends CardType {
    // pinOTP: string;
}

export interface CreditCardType extends CardType {
    cvc: string;
    addressRegister: string;
}