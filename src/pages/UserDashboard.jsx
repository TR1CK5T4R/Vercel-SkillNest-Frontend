import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getUserEnrollments } from '../services/api';
import Navbar from '../components/common/Navbar';
import Loader from '../components/common/Loader';

function UserDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        totalHoursLearned: 0
    });

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getUserEnrollments();

            // Handle different API response structures
            const enrollmentData = data.enrollments || data || [];
            setEnrollments(enrollmentData);

            // Calculate stats
            calculateStats(enrollmentData);
        } catch (err) {
            setError(err.message || 'Failed to fetch enrollments');
            setEnrollments([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (enrollmentData) => {
        const completed = enrollmentData.filter(e => e.status === 'completed' || e.progress === 100).length;
        const inProgress = enrollmentData.filter(e => e.status === 'active' && e.progress < 100).length;
        const totalHours = enrollmentData.reduce((acc, e) => {
            const courseHours = e.course?.duration || 0;
            const progress = e.progress || 0;
            return acc + (courseHours * progress / 100);
        }, 0);

        setStats({
            totalCourses: enrollmentData.length,
            completedCourses: completed,
            inProgressCourses: inProgress,
            totalHoursLearned: Math.round(totalHours)
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Welcome back, {user?.firstName}! 👋
                    </h1>
                    <p className="text-gray-600">
                        Track your learning progress and continue your courses
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {/* Total Courses */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Courses</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">
                                    {stats.totalCourses}
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* In Progress */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">In Progress</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">
                                    {stats.inProgressCourses}
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Completed */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Completed</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">
                                    {stats.completedCourses}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Hours Learned */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Hours Learned</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">
                                    {stats.totalHoursLearned}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Courses Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
                        <button
                            onClick={() => navigate('/courses')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Browse More Courses
                        </button>
                    </div>

                    {/* Loading State */}
                    {loading && <Loader />}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <p className="font-medium">Error loading enrollments</p>
                            <p className="text-sm">{error}</p>
                            <button
                                onClick={fetchEnrollments}
                                className="mt-2 text-sm underline"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {/* Enrollments List */}
                    {!loading && !error && (
                        <>
                            {enrollments.length > 0 ? (
                                <div className="space-y-4">
                                    {enrollments.map((enrollment) => (
                                        <div
                                            key={enrollment._id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Course Thumbnail */}
                                                <div className="w-32 h-20 shrink-0 bg-gray-200 rounded overflow-hidden">
                                                    <img
                                                        src={enrollment.course?.thumbnail || 'https://via.placeholder.com/200x150?text=Course'}
                                                        alt={enrollment.course?.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Course Info */}
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                                                        {enrollment.course?.title || 'Course Title'}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        By {enrollment.course?.instructor || 'Unknown Instructor'}
                                                    </p>

                                                    {/* Progress Bar */}
                                                    <div className="mb-2">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-sm text-gray-600">Progress</span>
                                                            <span className="text-sm font-medium text-gray-800">
                                                                {enrollment.progress || 0}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${enrollment.progress || 0}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className="flex items-center gap-2">
                                                        {enrollment.status === 'completed' || enrollment.progress === 100 ? (
                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                                                                ✓ Completed
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-medium">
                                                                In Progress
                                                            </span>
                                                        )}
                                                        {enrollment.certificateIssued && (
                                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">
                                                                🏆 Certificate Earned
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Continue Button */}
                                                <div className="shrink-0">
                                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                                                        Continue Learning
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-6xl mb-4">📚</div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                        No courses enrolled yet
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Start your learning journey by enrolling in courses
                                    </p>
                                    <button
                                        onClick={() => navigate('/courses')}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                                    >
                                        Browse Courses
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;