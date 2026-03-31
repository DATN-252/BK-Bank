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

  saveTokenMessage: async (token: string) => {
    await axiosClient.post('/customer/push-token', { token });
    return token;
  },

  CreditCardPayments: async (loanId: string, billingDate: string, data: any) => {
    const res = await axiosClient.get(`/customer/me/loans/${loanId}/monthly-statements/${billingDate}/payments`);
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

  lockCard: async (cardId: number) => {
    // Gọi API khóa thẻ
    const res = await axiosClient.post(`/customer/me/cards/${cardId}/lock`);
    return res.data;
  },

  unlockCard: async (cardId: number) => {
    // Gọi API mở khóa thẻ
    const res = await axiosClient.post(`/customer/me/cards/${cardId}/unlock`);
    return res.data;
  }
};

export default CustService;