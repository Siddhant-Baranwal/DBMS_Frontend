import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default axiosInstance;


// To import:
// import axiosInstance from '../../api/axiosInstance';