import axiosClient from './axiosClient';
import { PaymentCreditType, PaymentPreviewCreditType } from '@/types/payment';
import { getDeviceInfo } from './infoDevice';

export const AUTH_KEY = 'auth';

const PayService = {
  paymentPreviewCredit: async (data: PaymentPreviewCreditType) => {
    const res = await axiosClient.post('/payment/preview', data);
    return res.data;
  },

  paymentCredit: async (data: PaymentCreditType) => {
    const deviceInfo = await getDeviceInfo();
    data.latitude = deviceInfo.lat;
    data.longitude = deviceInfo.lng;

    console.log('log infoDevice', data);

    const res = await axiosClient.post('/payment/credit-card', data);
    return res.data;
  },
};

export default PayService;