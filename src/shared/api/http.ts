import axios, { type AxiosResponse } from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    return Promise.reject(error);
  },
);
