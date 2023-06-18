import axios from 'axios';

console.log(process.env.NODE_ENV);

const client = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/api' : process.env.API_URL,
});

export default client;
