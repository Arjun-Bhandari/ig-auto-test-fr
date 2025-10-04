"use client";

import axios from "axios";
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    //here can't do this because it seems api instance is used in ssr, so localstorage undefined errrors
    // Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    // "refresh-token": `${localStorage.getItem("refreshToken")}`,
  },
});

api.interceptors.request.use((config) => {
  const env = process.env.NEXT_PUBLIC_NODE_ENV;
  if (env && env === "development") {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
console.log("AccessToken",accessToken)
console.log("RefreshToken", refreshToken)
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (refreshToken) {
      config.headers["refresh-token"] = refreshToken;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.data?.statusCode === 401 &&
      error.response?.data?.message === "Invalid Access Token" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshSuccess = await refreshAccessToken();
        //here the function refreshaccessstoken will take care of everything
        if (refreshSuccess) {
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.log("Token refresh failed:", refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await api.get(`${BACKEND_URL}/auth/refresh`);
    handleTokensInLocalStorage(response.data.tokens);
    return true;
  } catch (error) {
    console.log("error in refresh token", error);
    return false;
  }
}

function handleTokensInLocalStorage(tokens: {
  refreshToken: string;
  accessToken: string;
}) {
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
}