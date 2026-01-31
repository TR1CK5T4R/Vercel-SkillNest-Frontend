import { useState, useEffect } from 'react';
import { getCourses } from '../services/api';
import CourseCard from '../components/courses/CourseCard';
import Navbar from '../components/common/Navbar';
import Loader from '../components/common/Loader';

function CourseListingPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        level: ''
    });

    // Fetch courses from database
    useEffect(() => {
        fetchCourses();
    }, [filters]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getCourses(filters);

            // Handle different API response structures
            if (data.courses) {
                setCourses(data.courses);
            } else if (Array.isArray(data)) {
                setCourses(data);
            } else {
                setCourses([]);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch courses');
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setFilters({
            ...filters,
            search: e.target.value
        });
    };

    const handleCategoryChange = (e) => {
        setFilters({
            ...filters,
            category: e.target.value
        });
    };

    const handleLevelChange = (e) => {
        setFilters({
            ...filters,
            level: e.target.value
        });
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            level: ''
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Explore Courses
                    </h1>
                    <p className="text-gray-600">
                        Discover and learn from our collection of courses
                    </p>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 font-medium mb-2">
                                Search Courses
                            </label>
                            <input
                                type="text"
                                value={filters.search}
                                onChange={handleSearchChange}
                                placeholder="Search by title or instructor..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Category
                            </label>
                            <select
                                value={filters.category}
                                onChange={handleCategoryChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Categories</option>
                                <option value="Web Development">Web Development</option>
                                <option value="Mobile Development">Mobile Development</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Machine Learning">Machine Learning</option>
                                <option value="UI/UX Design">UI/UX Design</option>
                                <option value="DevOps">DevOps</option>
                                <option value="Cybersecurity">Cybersecurity</option>
                            </select>
                        </div>

                        {/* Level Filter */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Level
                            </label>
                            <select
                                value={filters.level}
                                onChange={handleLevelChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Levels</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {(filters.search || filters.category || filters.level) && (
                        <div className="mt-4">
                            <button
                                onClick={clearFilters}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading && <Loader />}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p className="font-medium">Error loading courses</p>
                        <p className="text-sm">{error}</p>
                        <button
                            onClick={fetchCourses}
                            className="mt-2 text-sm underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Courses Grid */}
                {!loading && !error && (
                    <>
                        {courses.length > 0 ? (
                            <>
                                <div className="mb-4 text-gray-600">
                                    {courses.length} course{courses.length !== 1 ? 's' : ''} found
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {courses.map((course) => (
                                        <CourseCard key={course._id} course={course} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📚</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    No courses found
                                </h3>
                                <p className="text-gray-500">
                                    Try adjusting your filters or search terms
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default CourseListingPage;