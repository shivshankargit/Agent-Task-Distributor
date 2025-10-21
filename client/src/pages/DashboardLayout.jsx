import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User, UploadCloud } from 'lucide-react'; 

/**
 * Main layout component for the admin dashboard.
 * Includes the header, navigation tabs, and content area.
 */
export default function DashboardLayout() {
    // Get auth state and logout function from the AuthContext
    const { user, logout } = useAuth();
    // Hook for programmatic navigation
    const navigate = useNavigate();

    // Handles the logout process
    const handleLogout = async () => {
        try {
            // Call the logout function from AuthContext
            await logout();
            // Redirect user to the login page after logout
            navigate('/login');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    // Dynamically sets the CSS classes for active/inactive NavLink tabs
    const getTabClass = ({ isActive }) => {
        return isActive
            ? 'flex items-center justify-center gap-2 px-4 py-3 font-semibold text-blue-600 bg-blue-100 rounded-lg'
            : 'flex items-center justify-center gap-2 px-4 py-3 font-medium text-gray-600 rounded-lg transition-colors hover:text-blue-600 hover:bg-gray-100';
    };

    // Gets the first letter of the user's email for the avatar
    const getUserInitial = () => {
        return user?.email ? user.email[0].toUpperCase() : '?';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Blue Top Bar */}
            <header className="sticky top-0 z-50 w-full bg-blue-600 shadow-md">
                <div className="container flex items-center justify-between h-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* App Title */}
                    <h1 className="text-xl font-bold text-white">
                        Distributed-lists
                    </h1>

                    {/* User Info & Logout Section */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            {/* User avatar with the first initial */}
                            <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-blue-400 rounded-full font-bold text-white">
                                {getUserInitial()}
                            </div>
                            {/* Logout Button */}
                            <span className="hidden sm:block text-sm font-medium text-white">
                                {user?.email}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:block">Logout</span>
                        </button>
                    </div>

                </div>
            </header>

            {/* Main Content Area */}
            <main className="container py-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Page Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Admin Dashboard
                </h1>
                <p className="mt-1 text-base sm:text-lg text-gray-600">
                    Manage agents and distribute work efficiently.
                </p>

                {/* Tab Navigation */}
                <div className="mt-6">
                    <div className="flex flex-col sm:flex-row p-1 space-y-1 sm:space-y-0 sm:space-x-1 bg-gray-200 rounded-lg w-full sm:w-auto sm:max-w-sm">
                        <NavLink to="/dashboard/agents" className={getTabClass}>
                            <User className="w-5 h-5" />
                            <span>Agents</span>
                        </NavLink>
                        <NavLink to="/dashboard/lists" end className={getTabClass}>
                            <UploadCloud className="w-5 h-5" />
                            <span>Upload & Distribute</span>
                        </NavLink>
                    </div>
                </div>

                {/* Page Content (Agents or Lists) Renders Here */}
                <div className="mt-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}