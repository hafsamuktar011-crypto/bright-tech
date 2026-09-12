import { createContext, useState, useEffect } from "react";
import { api } from "../service/axiosInstance.js";

const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    loading: true,
  });

  const setUser = (data) => {
    setState((prev) => ({
      ...prev,
      user: data,
    }));
  };

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,

      async (error) => {
        const originalRequest = error.config;

        if (
          (error.response?.status === 401 ||
            error.response?.status === 403) &&
          !originalRequest?._retry
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
    loading: state.loading,
    setUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};



export default UserContext;