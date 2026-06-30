import axios from "axios";
import { notify } from "../utils/notify";
import { clearAuthStorage, getStoredAuth, saveAuthSession } from "../utils/authStorage";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

let refreshPromise = null;

const clearAuth = () => {
  clearAuthStorage();
};

// Tự động thêm token
axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = getStoredAuth();
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

    const { refreshToken } = getStoredAuth();
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
      saveAuthSession({
        ...getStoredAuth().user,
        ...refreshResponse.data,
        jwt: newAccessToken,
        refreshToken: newRefreshToken,
      });

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
