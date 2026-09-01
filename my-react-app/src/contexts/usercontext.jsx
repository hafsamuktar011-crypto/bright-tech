// step one 
import { useContext, createContext, useState } from "react";
// stept two create your context
const UserContext = createContext()
// step three create context provider
export const UserContextProvider = ({ children }) => {
    const [state, setState] = useState(() => {
        let savedUser = localStorage.getItem("user")
        if (savedUser) {
            return { user: JSON.parse(savedUser) }
        }
        return {user:null}
    })
    const setUser = (data) => {
        if (data) {
            localStorage.setItem("user", JSON.stringify(data))
        } else {
            localStorage.removeItem("user")
        }
        setState({ user: data })
    }
    return <UserContext.Provider value={{ state, setUser }}>
        {children}
    </UserContext.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => {
    return useContext(UserContext)
}
