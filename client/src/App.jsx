import { Route, Routes, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthProvider"
import { Toaster } from "sonner"

// --- Page Imports ---
import LoginPage  from "./pages/LoginPage"
import DashboardLayout from "./pages/DashboardLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import ListsPage from "./pages/ListsPage"
import AgentsPage from "./pages/Agentspage"

/**
 * Main application component that sets up routing.
 */
function App() {

  return (
    // Provides authentication context (user, login, logout) to the entire app
    <AuthProvider>
      <Routes>
        {/* Public route for the login page */}
        <Route path="/login" element={<LoginPage/>}/>

        {/* Protected layout route for the main dashboard */}
        <Route 
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout/>
            </ProtectedRoute>
          }
        >
          {/* Default child route for /dashboard. Redirects to 'lists' */}
          <Route index element={<Navigate to="/dashboard/lists" replace />} />

          {/* Renders the ListsPage inside the DashboardLayout (at /dashboard/lists) */}
          <Route path="lists" element={<ListsPage />} />

          {/* Renders the AgentsPage inside the DashboardLayout (at /dashboard/agents) */}
          <Route path="agents" element={<AgentsPage />} />

        </Route>

        {/* Redirects the root URL ('/') to the dashboard */}
        <Route path="/" element={<Navigate to="/dashboard/lists" replace />} />

        {/* Catch-all route for any undefined paths (404) */}
        { <Route path="*" element={<div>404 Not Found</div>} />}
      </Routes>

      {/* Global notification component (for toast messages) */}
      <Toaster richColors />
    </AuthProvider>
  )
};

export default App;
