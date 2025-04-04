import axios from 'axios';

// Adjust baseURL if your backend is on a different port or domain
// For Development Environment, REACT_APP_API_URL is defined in root folder .env file 
// (e.g. .env > REACT_APP_API_URL=http://localhost:5050/api)
// For Production Environment, REACT_APP_API_URL is defined in the server's environment variables. 
// (e.g. Vercel.com Environment Variables Setting > REACT_APP_API_URL: https://clinical-trials-hub-backend.onrender.com/api)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export default api;