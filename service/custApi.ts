import axiosClient, { axiosClientCMS } from './axiosClient';


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

  saveTokenMessage: async (token: string) => {
    await axiosClient.post('/customer/push-token', { token });
    return token;
  },

  postCreditCardPayments: async (loanId: string, billingDate: string, data: any) => {
    const res = await axiosClient.post(`/customer/me/loans/${loanId}/monthly-statements/${billingDate}/payments`, data);
    return res.data;
  },

  getInfoLoan: async () => {
    const res = await axiosClient.get('/customer/me/loans');
    return res.data;
  },

  getInfoSaving: async () => {
    const res = await axiosClient.get('/customer/me/savings');
    return res.data;
  },
  
  getAllTermStatements: async () => {
    const res = await axiosClient.get('/customer/me/statements');
    return res.data;
  },

  getAllTermStatementsbyLoanId: async (loanId: string) => {
    const res = await axiosClient.get(`/customer/me/loans/${loanId}/monthly-statements`);
    return res.data;
  },

  getStatementsbyLoanIdAndBillingDate: async (loanId: string, billingDate: string) => {
    const res = await axiosClient.get(`/customer/me/statement?loanId=${loanId}&billingDate=${billingDate}`);
    return res.data;
  },

  postLockCard: async (cardId: number) => {
    // Gọi API khóa thẻ
    const res = await axiosClientCMS.post(`/api/cards/${cardId}/lock`);
    return res.data;
  },

  postUnlockCard: async (cardId: number) => {
    // Gọi API mở khóa thẻ
    const res = await axiosClientCMS.post(`/api/cards/${cardId}/unlock`);
    return res.data;
  },

  getNotiFraud: async () => {
    const res = await axiosClient.get(`/customer/me/fraud-alerts`);
    return res.data;
  },

  postRejectTransaction: async (alertId: string) => {
    const res = await axiosClient.post(`/customer/me/fraud-alerts/${alertId}/reject`);
    return res.data;
  },

  postConfirmTransaction: async (alertId: string) => {
    const res = await axiosClient.post(`/customer/me/fraud-alerts/${alertId}/confirm`);
    return res.data;
  }
};

export default CustService;