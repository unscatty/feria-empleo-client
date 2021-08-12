import axios from 'axios';
import { config } from 'dotenv';

config();

axios.defaults.baseURL = process.env.VUE_APP_SERVER_HOST;
axios.defaults.headers.common['Authorization'] =
  'Bearer ' + localStorage.getItem(process.env.VUE_APP_B2C_TOKEN || '')

axios.interceptors.request.use(
  (config) => {
    const token =  localStorage.getItem(process.env.VUE_APP_B2C_TOKEN || '')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);
