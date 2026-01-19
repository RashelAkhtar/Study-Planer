import axios from "axios";

const DEFAULT_PORT = process.env.API_PORT || 3000;

const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || `http://localhost:${DEFAULT_PORT}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export default axiosInstance;