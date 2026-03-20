import axiosClient from './axiosClient';
import { PaymentCreditType, PaymentPreviewCreditType } from '@/types/payment';


export const AUTH_KEY = 'auth';

const PayService = {
  paymentPreviewCredit: async (data: PaymentPreviewCreditType) => {
    const res = await axiosClient.post('/payment/preview', data);
    return res.data;
  },

  paymentCredit: async (data: PaymentCreditType) => {
    const res = await axiosClient.post('/payment/credit-card', data);
    return res.data;
  },
};

export default PayService;