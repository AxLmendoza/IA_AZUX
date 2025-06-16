import axios from 'axios';

const API = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:2018/api'
});

// Interceptor para incluir token en todas las peticiones
API.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function login({ email, pwd }) {
  return API.post('/auth/login', { email, pwd })
    .catch(err => {
      console.error('API login error:', err); // <-- Agregado
      throw err;
    });
}