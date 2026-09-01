import axios from 'axios';
import i18n from '../../i18n';
import { STORAGE_KEYS } from '../utils/constants';
import { showToast } from '../utils/toastBus';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Every request carries the JWT if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (token)
      config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

// Turn the common HTTP failures into toast
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (!response) {
      if (error.request)
        showToast.error(i18n.t('common:errors.networkError'));

      return Promise.reject(error);
    }

    const message = response.data?.message || response.data?.error;

    switch (response.status) {
      case 401:
        if (!window.location.pathname.includes('/login')) {
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
          showToast.warning(i18n.t('common:session.expired'));
          window.location.href = '/login';
        }
        break;

      case 403:
        showToast.error(i18n.t('common:session.accessDenied'));
        break;

      case 404:
        showToast.error(message || i18n.t('common:session.notFound'));
        break;

      case 400:
        showToast.warning(message || i18n.t('common:session.invalidRequest'));
        break;

      case 409:
        showToast.warning(message || i18n.t('common:session.conflict'));
        break;

      case 500:
        showToast.error(i18n.t('common:session.serverError'));
        break;

      default:
        showToast.error(message || i18n.t('common:session.unexpected'));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
