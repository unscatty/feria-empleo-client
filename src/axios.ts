import { container } from '@/app.container';
import AuthService from '@/auth/auth.service';
import axios from 'axios';
import { config } from 'dotenv';
import router from './routes';

config();

axios.defaults.baseURL = process.env.VUE_APP_SERVER_HOST;
axios.defaults.headers.common['Authorization'] =
  'Bearer ' + localStorage.getItem(process.env.VUE_APP_B2C_TOKEN || '');

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(process.env.VUE_APP_B2C_TOKEN || '');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.data && error.response.data.error) {
      const errorCode = error.response.data.error;

      if (error.response.status === 401) {
        const authService = container.get(AuthService);
        authService.login();
      }

      switch (errorCode) {
        case 'NOT_USER_REGISTER':
          router.replace('/registro').catch((e) => {
            console.log(e);
          });
          break;

        default:
          break;
      }
    }

    return Promise.reject(error);
  }
);
