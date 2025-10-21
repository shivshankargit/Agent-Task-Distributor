import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * A custom hook to easily access the AuthContext.
 * This simplifies consuming the context from any component.
 */
export const useAuth = () => {
    // Returns the value of the AuthContext (user, loading, login, logout)
    return useContext(AuthContext);
};