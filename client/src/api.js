import axios from 'axios';

// Every request goes through this Axios instance, which attaches the JWT automatically.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the server rejects the token (expired or invalid), the app logs the user out.
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAuthForm = url.startsWith('/auth/login') || url.startsWith('/auth/register');
    if (error.response?.status === 401 && !isAuthForm) onUnauthorized();
    return Promise.reject(error);
  }
);

export const errorMessage = (error) =>
  error.response?.data?.message || 'Could not reach the server. Check that the API is running.';

export default api;
