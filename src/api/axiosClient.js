import axios from 'axios';
import { clearSessionStorage, getToken } from '../storage/tokenStorage.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await clearSessionStorage();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const responseData = error?.response?.data;
  return (
    responseData?.detail ||
    responseData?.message ||
    responseData?.error ||
    (responseData ? JSON.stringify(responseData) : '') ||
    error?.message ||
    fallback
  );
}

export default axiosClient;
