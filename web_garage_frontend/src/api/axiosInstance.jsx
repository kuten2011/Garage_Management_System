import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://${window.location.hostname}:8080`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động thêm token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      alert("Phiên đăng nhập hết hạn!");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;