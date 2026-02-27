interface CardType {
    cardNumber: string;
    dateCard: string;
    amount: number;
    cardHolder: string;
    bank: string;
}

export interface DebitCardType extends CardType {
    // pinOTP: string;
}

export interface CreditCardType extends CardType {
    merchantId: string;
    zip: string;
    cvc: string;
    addressRegister: string;
    currency: string;
}