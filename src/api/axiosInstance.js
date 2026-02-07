import axios from "axios";

export const BACKEND_URL =
  "https://full-stack-project-6-g1yc.onrender.com";

const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api/`,
  headers: { "Content-Type": "application/json" },
});

// Automatically add token if exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem("access");
    if (token && error.response?.status === 401) {
      localStorage.removeItem("access");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
