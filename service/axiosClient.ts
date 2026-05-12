import axios from "axios";
import { getToken, removeToken } from "../store/localStorage";

const axiosClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_LEDGER_URL,
  timeout: 40000,
  headers: {
    "Content-Type": "application/json",
  },
});
const axiosClientCMS = axios.create({
  baseURL: process.env.EXPO_PUBLIC_CMS_URL,
  timeout: 40000,
  headers: {
    "Content-Type": "application/json",
  },
});

// thêm token vào header của mỗi request nếu có
axiosClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosClientCMS.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// tự động logout nếu token hết hạn (401)
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
      // console.log("Token expired -> logout");
    }

    return Promise.reject(error);
  }
);
axiosClientCMS.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
      // console.log("Token expired -> logout");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
export { axiosClientCMS };