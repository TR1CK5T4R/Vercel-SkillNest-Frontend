import axios from 'axios';

// Base API URL - change this based on your environment
const API_BASE_URL = 'http://localhost:8001/api/v1';

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
                    // Unauthorized - token expired or invalid
                    console.error('Unauthorized access - logging out');

                    // Clear auth data
                    localStorage.removeItem('skillnest_token');
                    localStorage.removeItem('skillnest_user');

                    // Redirect to login page
                    window.location.href = '/login';
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
    console.log(' API: Sending login request...');
    console.log(' API: URL:', `${API_BASE_URL}/auth/login`);
    console.log(' API: Credentials:', credentials);

    const response = await axiosInstance.post('/users/login', credentials);

    console.log(' API: Raw axios response:', response);
    console.log(' API: response.data:', response.data);

    const apiResponse = response.data;

    console.log(' API: apiResponse:', apiResponse);
    console.log(' API: apiResponse.data:', apiResponse.data);
    console.log(' API: apiResponse.data.accessToken:', apiResponse.data?.accessToken);
    console.log('🟡API: apiResponse.data.user:', apiResponse.data?.user);


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

    console.log('API: Transformed response:', transformedResponse);
    console.log('API: Returning token:', transformedResponse.token);
    console.log(' API: Returning user:', transformedResponse.user);

    return transformedResponse;
};

export const register = async (userData) => {
    console.log(' API: Sending register request...');

    const response = await axiosInstance.post('/users/register', userData);

    console.log('🔍 response.data:', response.data);
    console.log('🔍 response.data.data:', response.data.data);
    console.log('🔍 response.data.data.user:', response.data.data?.user);

    console.log('API: Register response:', response.data);

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