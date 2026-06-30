import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

export function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredAuth() {
  const token = localStorage.getItem(TOKEN_KEY) || "";
  const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || "";

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem(USER_KEY) || "{}");
  } catch {
    user = {};
  }

  const refreshToken = storedRefreshToken || user.refreshToken || "";
  const normalizedUser = {
    ...user,
    jwt: user.jwt || token,
    refreshToken,
  };

  return { token, refreshToken, user: normalizedUser };
}

export function saveAuthSession(authData) {
  const token = authData?.jwt || authData?.token || "";
  const refreshToken = authData?.refreshToken || "";
  const userData = { ...authData };

  delete userData.token;
  delete userData.jwt;
  delete userData.refreshToken;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      ...userData,
      jwt: token,
      refreshToken,
    }),
  );
}

export function getStoredRoles() {
  const { token, user } = getStoredAuth();
  const authorities = Array.isArray(user.authorities) ? user.authorities : [];

  if (authorities.length > 0) {
    return authorities.map((auth) => (typeof auth === "string" ? auth : auth.authority)).filter(Boolean);
  }

  if (!token) return [];

  try {
    const decoded = jwtDecode(token);
    const claims = decoded?.roles || decoded?.authorities || [];
    if (!Array.isArray(claims)) return [];
    return claims
      .map((auth) => (typeof auth === "string" ? auth : auth.authority || auth.role))
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function getStoredAccountId() {
  const { user } = getStoredAuth();
  return user.maKH || user.maNV || user.username || "";
}

export function isAuthenticated() {
  const { token, refreshToken } = getStoredAuth();
  return Boolean(token || refreshToken);
}
