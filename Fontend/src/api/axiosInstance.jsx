import axios from "axios";
import { notify } from "../utils/notify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

let refreshPromise = null;

const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

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
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/refresh")) {
      clearAuth();
      window.location.href = "/login";
      notify("Phiên đăng nhập hết hạn!", "error");
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      clearAuth();
      window.location.href = "/login";
      notify("Phiên đăng nhập hết hạn!", "error");
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      clearAuth();
      window.location.href = "/login";
      notify("Phiên đăng nhập hết hạn!", "error");
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshClient
          .post("/auth/refresh", { refreshToken })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const refreshResponse = await refreshPromise;

      const newAccessToken = refreshResponse.data.jwt;
      const newRefreshToken = refreshResponse.data.refreshToken || refreshToken;

      localStorage.setItem("token", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          ...refreshResponse.data,
          jwt: newAccessToken,
          refreshToken: newRefreshToken,
        }),
      );

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      clearAuth();
      window.location.href = "/login";
      notify("Phiên đăng nhập hết hạn!", "error");
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;
