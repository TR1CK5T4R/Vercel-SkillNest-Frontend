import axios from 'axios';

// Base API URL - change this based on your environment
// const API_BASE_URL = 'http://localhost:8001/api/v1';
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
    withCredentials: true, // Include cookies in requests
});

// Request interceptor - automatically attach JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('skillnest_token');

        // If token exists, add it to headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        // Return successful response data
        return response;
    },
    (error) => {
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Don't redirect if already on login page or if this is a login attempt
                    const isLoginPage = window.location.pathname === '/login';
                    const isLoginRequest = error.config?.url?.includes('/login');

                    if (!isLoginPage && !isLoginRequest) {
                        // Unauthorized - token expired or invalid
                        console.error('Unauthorized access - logging out');

                        // Clear auth data
                        localStorage.removeItem('skillnest_token');
                        localStorage.removeItem('skillnest_user');

                        // Redirect to login page
                        window.location.href = '/login';
                    } else {
                        // On login page, just show the error
                        console.error('Login failed:', data?.message);
                    }
                    break;

                case 403:
                    console.error('Access forbidden');
                    break;

                case 404:
                    console.error('Resource not found');
                    break;

                case 500:
                    console.error('Server error occurred');
                    break;

                default:
                    console.error('An error occurred:', data?.message || 'Unknown error');
            }

            return Promise.reject(data || { message: 'Something went wrong' });
        } else if (error.request) {
            console.error('No response from server');
            return Promise.reject({ message: 'Network error - please check your connection' });
        } else {
            console.error('Error:', error.message);
            return Promise.reject({ message: error.message });
        }
    }
);


// AUTH API FUNCTIONS

export const login = async (credentials) => {
    try {
        const response = await axiosInstance.post('/users/login', credentials);

        const apiResponse = response.data;

        // Return in the format AuthContext expects
        const transformedResponse = {
            success: apiResponse.success,
            token: apiResponse.data.accessToken,  // accessToken from your backend
            user: {
                _id: apiResponse.data.user._id,
                email: apiResponse.data.user.email,
                firstName: apiResponse.data.user.username,  // Using username as firstName
                lastName: '',  // Your backend doesn't have lastName
                role: apiResponse.data.user.role || 'user'  // Default to 'user' if no role
            }
        };


        return transformedResponse;
    } catch (error) {
        {
            console.error(' API: Login request failed:', error);

            // Handle axios error response
            if (error.response) {
                // Server responded with error status (400, 401, etc.)
                console.error(' API: Server error response:', error.response.data);
                throw new Error(error.response.data?.message || 'Invalid email or password');
            } else if (error.request) {
                // Request made but no response received
                console.error(' API: No response received');
                throw new Error('Network error - please check your connection');
            } else {
                // Something else happened
                console.error(' API: Error:', error.message);
                throw new Error(error.message || 'Login failed');
            }
        }
    };
}

export const register = async (userData) => {

    const response = await axiosInstance.post('/users/register', userData);

    const apiResponse = response.data;

    // Return in the format AuthContext expects
    return {
        success: apiResponse.success,
        token: apiResponse.data.accessToken,
        user: {
            _id: apiResponse.data.user._id,
            email: apiResponse.data.user.email,
            username: apiResponse.data.user.username,
            role: apiResponse.data.user.role || 'user'
        }
    };
};

// COURSE API FUNCTIONS


export const getCourses = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.level) params.append('level', filters.level);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await axiosInstance.get(`/courses?${params.toString()}`);

    console.log('🔍 Courses response:', response.data);

    // Backend returns: { success: true, data: [...courses...], message: "..." }
    return response.data.data; // Extract the courses array
};

export const getCourseById = async (id) => {
    const response = await axiosInstance.get(`/courses/${id}`);
    return response.data.data; // Extract the course object
};

// ENROLLMENT API FUNCTIONS

export const getUserEnrollments = async () => {
    const response = await axiosInstance.get('/enrollments');
    console.log('🔍 Enrollments response:', response.data);

    // Backend wraps it: { success: true, data: [...courses...], message: "..." }
    return response.data.data; // Extract the array from .data.data
};

export const enrollInCourse = async (courseId) => {
    const response = await axiosInstance.post(`/enrollments/${courseId}`);
    return response.data.data; // Extract the data
};

export const unenrollFromCourse = async (courseId) => {
    const response = await axiosInstance.delete(`/enrollments/${courseId}`);
    return response.data; // This one returns null, so just return the whole response
};

// Export axios instance for direct use if needed
export default axiosInstance;