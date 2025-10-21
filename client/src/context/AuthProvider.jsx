import React, { useState, useEffect } from "react";
import apiClient from "../api/axios";
import { AuthContext } from "./AuthContext";
import { toast } from "sonner";


/**
 * Provides authentication state (user, loading) and functions (login, logout)
 * to the entire application.
 */
export const AuthProvider = ({ children }) => {

    // Holds the authenticated user object (or null)
    const [user, setUser] = useState(null);
    // Tracks the initial check to see if a user is already logged in
    const [loading, setLoading] = useState(true);

    // Check if a user is already logged in when the app first loads
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                // Attempt to get user data from the backend's "check" route
                const response = await apiClient.get("/admin/check");
                setUser(response.data.user);
            } catch (error) {
                // No user is logged in
                console.log("No user logged in (auth check failed).");
                setUser(null);
            } finally {
                // Auth check is finished, app can now render
                setLoading(false);
            }
        };
        checkLoggedIn();
    }, []); // Empty array ensures this runs only once on mount

    // Function to log in the user
    const login = async (email, password) => {
        // Call the sign-in API
        const response = await apiClient.post("/admin/signin", { email, password });
        // Update the user state
        setUser(response.data.user);
        return response.data; 
    };

    // Function to log out the user
    const logout = async () => {
        try {
            // Call the logout API (to clear the cookie on the server)
            await apiClient.post("/admin/logout");
            // Clear the user from state
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed", {
                description: error.response?.data?.message || "Could not reach server.",
            });
        }
    };

    // The value to be provided to all consuming components
    const authValue = {
        user,
        login,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={authValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};