import axios from 'axios';

// Substitua a URL abaixo pela URL que aparece no topo do seu painel do Render
const api = axios.create({
  baseURL: 'https://ensina-logica-api.onrender.com', // Exemplo: cole a sua aqui
});

// Interceptador: injeta o token antes de cada requisição sair
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;