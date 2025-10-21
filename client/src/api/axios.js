import axios from "axios";

// Defines the base URL for all API requests
const API_BASE_URL = "http://localhost:3000/api";

// Create a pre-configured instance of axios
const apiClient = axios.create({
    // Sets the base URL to automatically prefix all requests
    baseURL: API_BASE_URL,
    // Allows sending cookies (like auth tokens) with cross-origin requests
    withCredentials: true,
});

export default apiClient;