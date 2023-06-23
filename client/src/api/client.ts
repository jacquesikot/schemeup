import axios from 'axios';

const DEV = 'https://schemeup-server.vercel.app/api';
const LOCAL = 'http://localhost:8080/api';

const client = axios.create({
  baseURL: DEV,
});

export default client;
