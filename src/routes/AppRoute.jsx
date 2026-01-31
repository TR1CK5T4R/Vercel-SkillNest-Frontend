import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Import Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CourseListingPage from '../pages/CourseListingPage';
import UserDashboard from '../pages/UserDashboard';
// import AdminDashboard from '../pages/AdminDashboard';

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes - Require Authentication */}
                <Route
                    path="/courses"
                    element={
                        <ProtectedRoute>
                            <CourseListingPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Only Routes - Require Admin Role */}
                {/* <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                /> */}

                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/courses" replace />} />

                {/* 404 Not Found */}
                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;