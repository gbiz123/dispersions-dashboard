import axios, { CancelToken } from 'axios';

const API_BASE_URL = 'https://l47qj.wiremockapi.cloud/aerscreen';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createCancelToken = () => axios.CancelToken.source();

export default api;