// src/service/axiosInstance.js
import axios from "axios";

// Create your base api client
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: true
});

// A localized helper to hold your token outside of React state loops
let dynamicToken = null;

export const setGlobalAccessToken = (token) => {
    dynamicToken = token;
};

// 1. Request Interceptor: Attach bearer tokens dynamically to outgoing requests
api.interceptors.request.use(
    (config) => {
        if (dynamicToken) {
            config.headers["Authorization"] = `Bearer ${dynamicToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Response Interceptor: Capture 401s and execute silent token refreshing
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip interceptor if the error came from the refresh endpoint itself to prevent infinite loops
        if (originalRequest.url?.includes("/auth/refresh-access-token")) {
            return Promise.reject(error);
        }

        // Catch 401 Unauthorized status codes
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                
                const res = await api.post("/auth/refresh-access-token");
                const { accessToken } = res.data;

                setGlobalAccessToken(accessToken);

                if (window.__onTokenRefreshed) {
                    window.__onTokenRefreshed(accessToken);
                }

                originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                
                setGlobalAccessToken(null);
                localStorage.removeItem("user");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);


