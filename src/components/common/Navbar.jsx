import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <h1 className="text-2xl font-bold">SkillNest</h1>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        <Link
                            to="/courses"
                            className="hover:text-blue-200 transition duration-200"
                        >
                            Courses
                        </Link>

                        {isAuthenticated && (
                            <Link
                                to="/dashboard"
                                className="hover:text-blue-200 transition duration-200"
                            >
                                Dashboard
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <>
                                {/* User Info */}
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium">
                                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                        </span>
                                    </div>
                                    <span className="text-sm">
                                        {user?.firstName} {user?.lastName}
                                    </span>
                                </div>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition duration-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Login & Register Links */}
                                <Link
                                    to="/login"
                                    className="hover:text-blue-200 transition duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded font-medium transition duration-200"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;