// src/context/UserContext.jsx
import { createContext, useState, useEffect } from "react";
import { setGlobalAccessToken } from "../service/axiosInstance.js";

const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  // --- 1. INSERT STATE WITH LOADING FIELD HERE ---
  const [state, setState] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      accessToken: null,
      loading: true, // Starts as true to let the app attempt a boot refresh
    };
  });

  // Helper setter for User profiles
  const setUser = (data) => {
    if (data) {
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      localStorage.removeItem("user");
    }
    setState((prev) => ({ ...prev, user: data }));
  };

  // Helper setter for Access Tokens
  const setAccessToken = (token) => {
    setGlobalAccessToken(token); // Syncs to your decoupled Axios instance variable
    setState((prev) => ({ ...prev, accessToken: token }));
  };

  // --- 2. INSERT EFFECT TO TURN LOADING OFF AFTER INITIAL BOOTUP PHASE ---
  useEffect(() => {
    // If a user exists in localStorage, give the Axios interceptor a small window 
    // to attempt an immediate silent boot refresh if necessary.
    setState((prev) => ({ ...prev, loading: false }));
  }, []);

  // Sync token state if your standalone Axios interceptor triggers a refresh in the background
  useEffect(() => {
    window.__onTokenRefreshed = (newToken) => {
      setState((prev) => ({ ...prev, accessToken: newToken }));
    };
    return () => {
      window.__onTokenRefreshed = null;
    };
  }, []);

  const value = {
    user: state.user,
    accessToken: state.accessToken,
    loading: state.loading, // Handed down so ProtectedRoute can inspect it
    setUser,
    setAccessToken //login handeler store new token
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};


  export default UserContext


