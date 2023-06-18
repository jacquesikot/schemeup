import axios from 'axios';

const client = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development' ? 'http://localhost:8080/api' : 'https://schemeup-server.vercel.app/api',
});

export default client;
