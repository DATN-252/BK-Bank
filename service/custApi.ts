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

  saveToken: async (token: string) => {
    await axiosClient.post('/customer/me/push-token', { token });
  }
};

export default CustService;