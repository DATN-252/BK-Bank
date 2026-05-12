import { TransactionCreditType, TransactionPreviewCreditType } from '@/types/payment';
import axiosClient from './axiosClient';
import { getDeviceInfo } from './infoDevice';

export const AUTH_KEY = 'auth';

const PayService = {
  paymentPreviewCredit: async (data: TransactionPreviewCreditType) => {
    const res = await axiosClient.post('/payment/preview', data);
    const deviceInfo = await getDeviceInfo();
    data.latitude = deviceInfo.lat;
    data.longitude = deviceInfo.lng;
    
    return res.data;
  },

  paymentCredit: async (data: TransactionCreditType) => {

    // console.log('log infoDevice', data);

    const res = await axiosClient.post('/payment/credit-card', data);
    return res.data;
  },
};

export default PayService;