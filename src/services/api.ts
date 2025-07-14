import axios, { CancelToken } from 'axios';

// const API_BASE_URL = 'https://1dgll.wiremockapi.cloud/';
const API_BASE_URL = 'http://172.20.0.5:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createCancelToken = () => axios.CancelToken.source();

export default api;
