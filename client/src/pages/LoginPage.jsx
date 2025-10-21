import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Loader2 } from 'lucide-react';

import Label from '../components/ui/Label';
import Input from '../components/ui/Input';
import Button from '../components/ui/button';

export default function LoginPage() {
    // --- State for the form inputs ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // --- State for form handling ---
    const [error, setError] = useState(''); // Stores login error messages
    const [isLoading, setIsLoading] = useState(false); // Tracks submission status

    // --- React Router & Auth Hooks ---
    const { login } = useAuth();  // Get the login function from AuthContext
    const navigate = useNavigate();  // Hook for programmatic navigation
    const location = useLocation();  // Hook to get current location state

    // Determines where to redirect after login
    // Tries to get the 'from' state (where the user was trying to go)
    // Defaults to the main dashboard page if no 'from' state exists
    const from = location.state?.from?.pathname || "/dashboard/lists";

    // Handles the login form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError(''); // Clear previous errors

        // Basic client-side validation
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setIsLoading(true); 
        try {
            // Call the login function from AuthContext
            await login(email, password);
            // On success, navigate to the intended page
            navigate(from, { replace: true });
        } catch (err) {
            // Handle login errors (network, server, credentials)
            let errorMessage = 'Login failed. Please check your credentials or try again later.';
            if (err.response) {
                // Server responded with an error
                errorMessage = err.response.data.message || errorMessage;
            } else if (err.request) {
                // Network error (no response)
                errorMessage = "Network error. Unable to reach server.";
            }
            setError(errorMessage);
            setIsLoading(false); // Stop loading on failure
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="w-full max-w-md p-8 space-y-6">

                {/* Icon */}
                <div className="flex justify-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                {/* Titles */}
                <h1 className="text-3xl font-bold text-center text-gray-900">
                    Agent Management
                </h1>
                <p className="text-center text-gray-600">
                    Sign in to your admin account
                </p>

                {/* Login Form Card */}
                <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-gray-50"
                                aria-describedby="error-message" 
                                disabled={isLoading} 
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-50"
                                aria-describedby="error-message" 
                                disabled={isLoading} 
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <p id="error-message" className="text-sm font-medium text-center text-red-600">
                                {error}
                            </p>
                        )}

                        {/* Submit Button with Loading State */}
                        <Button
                            type="submit"
                            variant="primary"
                            className="py-3 text-base flex justify-center items-center" 
                            disabled={isLoading} 
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}