import axiosClient from './axiosClient';
import { setToken, getToken, removeToken } from '../store/localStorage';
import { LoginType } from '../types/login';
import { registerForPush } from './notifyRealtime';


export const AUTH_KEY = 'auth';

const AuthService = {

  login: async (data: LoginType) => {
    const res = await axiosClient.post('/auth/login', {
      nameAcc: data.nameAcc,
      password: data.password,
    });
    const token = res.data.result.token;
    await setToken(token);

    
    // const tokenNoti = await registerForPush();
    // await axiosClient.post('/device-token', {
    //   token: tokenNoti,
    // });

    return res.data;
  },

  logout: async () => {
    await removeToken();
  },

  isAuthenticated: () => {
    return !!getToken();
  }
};

export default AuthService;