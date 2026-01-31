import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * ProtectedRoute Component
 * 
 * Restricts access to routes based on authentication
 * 
 * Props:
 * - children: Component to render if authorized
 * - requireAdmin: Boolean - if true, only admin users can access
 */
function ProtectedRoute({ children, requireAdmin = false }) {
    const { isAuthenticated, user, loading } = useAuth();

    // Show loading spinner while checking auth state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    // Check if admin access is required
    if (requireAdmin && user?.role !== 'admin') {
        // Redirect to courses page if user is not admin
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                    <p className="text-gray-700 mb-6">
                        You don't have permission to access this page.
                    </p>
                    <a
                        href="/courses"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Go to Courses
                    </a>
                </div>
            </div>
        );
    }

    // User is authenticated (and admin if required) - render children
    return children;
}

export default ProtectedRoute;