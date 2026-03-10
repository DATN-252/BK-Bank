import axiosClient from './axiosClient';
import { PaymentCreditType } from '@/types/payment';


export const AUTH_KEY = 'auth';

const PayService = {
  paymentCredit: async (data: PaymentCreditType) => {
    const res = await axiosClient.post('/payment/credit-card', {
      cardNumber: data.cardNumber,
      cvc: data.cvc,
      dateCard: data.dateCard,
      amount: data.amount,
      merchantId: data.merchantId,
      currency: data.currency,
    });
    return res.data;
  },
};

export default PayService;