import axios from 'axios';

// Adjust baseURL if your backend is on a different port or domain
const api = axios.create({
  baseURL: 'http://localhost:5050/api'
});

export default api;