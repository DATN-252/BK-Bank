interface CardType {
    cardNumber: string;
    dateCard: string;
    amount: number;
    cardHolder: string;
}

export interface DebitCardType extends CardType {
    // pinOTP: string;
}

export interface CreditCardType extends CardType {
    merchant: string;
    cvc: string;
    addressRegister: string;
    currency: string;
}