import { createContext, useState, useEffect } from 'react';
import { login as loginAPI, register as registerAPI } from '../services/api';

// Create Auth Context
export const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user and token from localStorage on initial mount
    useEffect(() => {
        const storedToken = localStorage.getItem('skillnest_token');
        const storedUser = localStorage.getItem('skillnest_user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            setError(null);
            setLoading(true);

            console.log('🟢 AuthContext: Starting login...');
            console.log('🟢 AuthContext: Credentials:', credentials);

            // Call login API
            const response = await loginAPI(credentials);

            console.log('🟢 AuthContext: API Response:', response);

            // Extract token and user from response
            const { token: newToken, user: newUser } = response;

            console.log('🟢 AuthContext: Token extracted:', newToken);
            console.log('🟢 AuthContext: User extracted:', newUser);

            if (!newToken || !newUser) {
                console.error('❌ AuthContext: Token or user is missing!');
                throw new Error('Invalid response from server');
            }

            // Save to state
            setToken(newToken);
            setUser(newUser);

            // Persist to localStorage
            localStorage.setItem('skillnest_token', newToken);
            localStorage.setItem('skillnest_user', JSON.stringify(newUser));

            console.log('✅ AuthContext: Login successful!');
            console.log('✅ AuthContext: Token saved to localStorage');
            console.log('✅ AuthContext: User saved to state');

            setLoading(false);
            return { success: true };
        } catch (err) {
            console.error('❌ AuthContext: Login error:', err);
            console.error('❌ AuthContext: Error message:', err.message);

            setLoading(false);
            setError(err.message || 'Login failed');
            return { success: false, error: err.message || 'Login failed' };
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            setError(null);
            setLoading(true);

            console.log('🟢 AuthContext: Starting registration...');

            // Call register API
            const response = await registerAPI(userData);

            console.log('🟢 AuthContext: Registration response:', response);

            // Extract token and user from response
            const { token: newToken, user: newUser } = response;

            if (!newToken || !newUser) {
                throw new Error('Invalid response from server');
            }

            // Save to state
            setToken(newToken);
            setUser(newUser);

            // Persist to localStorage
            localStorage.setItem('skillnest_token', newToken);
            localStorage.setItem('skillnest_user', JSON.stringify(newUser));

            console.log('✅ AuthContext: Registration successful!');

            setLoading(false);
            return { success: true };
        } catch (err) {
            console.error('❌ AuthContext: Registration error:', err);

            setLoading(false);
            setError(err.message || 'Registration failed');
            return { success: false, error: err.message || 'Registration failed' };
        }
    };

    // Logout function
    const logout = () => {
        console.log('🔴 Logging out...');

        // Clear state
        setUser(null);
        setToken(null);
        setError(null);

        // Clear localStorage
        localStorage.removeItem('skillnest_token');
        localStorage.removeItem('skillnest_user');

        console.log('✅ Logout complete');
    };

    // Check if user is authenticated
    const isAuthenticated = !!token && !!user;

    // Context value
    const value = {
        user,
        token,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};