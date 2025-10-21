import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // 1. Improves Loading State
    if (loading) {
        // Show a centered spinner
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    // 2. Redirect if not logged in
    if (!user) {
        // Pass the location state so the login page can redirect back
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Render the protected component if logged in
    return children;
};

export default ProtectedRoute;