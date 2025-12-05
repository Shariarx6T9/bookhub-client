import axios from 'axios';

const pendingRequests = new Map();

const apiProtection = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 8000,
});

apiProtection.interceptors.request.use((config) => {
  const key = `${config.method}-${config.url}`;
  if (pendingRequests.has(key)) {
    const controller = new AbortController();
    controller.abort();
    config.signal = controller.signal;
  } else {
    pendingRequests.set(key, config);
  }
  return config;
});

apiProtection.interceptors.response.use(
  (response) => {
    const key = `${response.config.method}-${response.config.url}`;
    pendingRequests.delete(key);
    return response;
  },
  (error) => {
    if (error.config) {
      const key = `${error.config.method}-${error.config.url}`;
      pendingRequests.delete(key);
    }
    return Promise.reject(error);
  }
);

export default apiProtection;