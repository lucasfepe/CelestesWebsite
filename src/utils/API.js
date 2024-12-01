// API.js

// Import axios for making HTTP requests
const axios = require('axios');

// Get the API Gateway URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_GATEWAY_URL;

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for handling tokens, etc.
apiClient.interceptors.request.use(
    (config) => {
        // Get token from storage if you're using authentication
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// API utility class
class API {
    // GET request
    static async get(endpoint, params = {}) {
        try {
            const response = await apiClient.get(endpoint, { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // POST request
    static async post(endpoint, data = {}) {
        try {
            const response = await apiClient.post(endpoint, data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // PUT request
    static async put(endpoint, data = {}) {
        try {
            const response = await apiClient.put(endpoint, data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // DELETE request
    static async delete(endpoint) {
        try {
            const response = await apiClient.delete(endpoint);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Error handler
    static handleError(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response error:', error.response.data);
            throw new Error(error.response.data.message || 'An error occurred');
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Request error:', error.request);
            throw new Error('No response received from server');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
            throw new Error('Error setting up request');
        }
    }
}

export default API;
