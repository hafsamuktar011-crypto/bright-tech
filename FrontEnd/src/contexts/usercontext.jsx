
import {  createContext, useState,useEffect } from "react";
import { api } from "../service/axiosInstance.js";

 const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
    const [state, setState] = useState(
        {user:null,accessToken:null}
    )
    const setUser = (data) => {
        // if (data) {
        //     localStorage.setItem("user", JSON.stringify(data))
        // } else {
        //     localStorage.removeItem("user")
        // }
        setState((prev) => ({...prev, user: data }))
    }
    const setAccessToken =(accessToken) =>{
        setState((prev)=>({...prev,accessToken}))
    }
useEffect(() => {
    const interceptor =api.interceptors.response.use(
        (response) => response,
        async(error) =>{
            const originalRequest =error.config;

            if (
                (error.response?.status === 401 || error.response?.status === 403) &&
                !originalRequest._retry &&
                !String(originalRequest?.url || "").includes("/auth/refresh-access-token") &&
                !String(originalRequest?.url || "").includes("/auth/login")
            )
            {
                originalRequest._retry=true
                try {
                    await api.post("/auth/refresh-access-token")
                    return api(originalRequest)
                } catch (refreshError) {
                    setUser(null)
                    return Promise.reject(refreshError)
                }
            }
            return Promise.reject(error)
        }
    )
    return () => {
      api.interceptors.response.eject(interceptor)  
    }
},[])

    return <UserContext.Provider value={{ state, setUser ,setAccessToken}}>
        {children}
    </UserContext.Provider>
}

export default UserContext

// () => {
//         let savedUser = localStorage.getItem("user")
//         if (savedUser) {
//             return { user: JSON.parse(savedUser) }
//         }
//         return {user:null,accessToken:null}
//     }
