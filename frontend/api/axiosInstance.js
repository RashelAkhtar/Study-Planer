import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 8000,
});

export default axiosInstance;