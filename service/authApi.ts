import axiosClient from './axiosClient';
import { setToken, getToken, removeToken } from './localStorage';
import { LoginType } from '../types/login';

export const AUTH_KEY = 'auth';

const AuthService = {
  login: async (data: LoginType) => {
    const res = await axiosClient.post('/auth/login', {
      nameAcc: data.nameAcc,
      password: data.password,
    });

    const token = res.data.result.token;
    await setToken(token);

    return res.data;
  },

  logout: async () => {
    removeToken();
  },

  isAuthenticated: () => {
    return !!getToken();
  }
};

export default AuthService;