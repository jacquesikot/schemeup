import axios from 'axios';

const client = axios.create({
  baseURL: 'https://schemeup-server.vercel.app/api',
});

export default client;
