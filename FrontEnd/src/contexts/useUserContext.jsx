import {useContext} from "react";
import {UserContext} from "../contexts/usercontext.jsx"

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return ctx;
};
