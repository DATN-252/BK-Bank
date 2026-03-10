import axiosClient from './axiosClient';


export const AUTH_KEY = 'auth';

const CustService = {
  getNotiBalance: async () => {
    const res = await axiosClient.get('/customer/me/transactions');
    return res.data;
  },

  getProfile: async () => {
    const res = await axiosClient.get('/customer/me');
    return res.data;
  },

  getCards: async () => {
    const res = await axiosClient.get('/customer/me/cards');
    return res.data;
  },
};

export default CustService;