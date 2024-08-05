import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
export const API_URL = process.env.REACT_APP_API_URL;

export const isSSR = () => typeof window === 'undefined';

function api(): AxiosInstance;
function api<T>(config: AxiosRequestConfig): AxiosPromise<T>;
function api(config?): any {
  const instance = axios.create({ baseURL: API_URL });

  // ssr
  if (!isSSR()) {
    const token = localStorage.getItem('token');
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && !isSSR()) {
        localStorage.removeItem('token');

        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );

  return config ? instance(config) : instance;
}

export { api };
