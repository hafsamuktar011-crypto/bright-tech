import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../service/axiosInstance.js";

const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      accessToken: null,
      loading: false,
    };
  });

  const setUser = (data) => {
    if (data) {
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      localStorage.removeItem("user");
    }
    setState((prev) => ({ ...prev, user: data }));
  };

  const setAccessToken = (token) => {
    setState((prev) => ({ ...prev, accessToken: token }));
  };

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          (error.response?.status === 401 || error.response?.status === 403) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            await api.post("/auth/refresh-access-token");
            return api(originalRequest);
          } catch (refreshError) {
            setUser(null);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  const value = {
    user: state.user,
    accessToken: state.accessToken,
    loading: state.loading,
    setUser,
    setAccessToken,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export function useUserContext() {
    return useContext(UserContext);
    
};
