function CourseCard({ course }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
            <img
                src={course.thumbnail || course.videoFile || 'https://via.placeholder.com/400x300?text=Course+Image'}
                alt={course.title}
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Course+Image';
                }}
            />

            {/* Course Info */}
            <div className="p-5">
                {/* Category & Level */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {course.category || 'General'}
                    </span>
                    <span className="text-xs text-gray-500 uppercase">
                        {course.level || 'Beginner'}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {course.title}
                </h3>

                {/* Instructor */}
                <p className="text-sm text-gray-600 mb-3">
                    By {course.instructor || 'Unknown Instructor'}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {course.description || 'No description available'}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    {/* Rating & Students */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center text-yellow-500">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm font-medium text-gray-700">
                                {course.rating || '0.0'}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500">
                            ({course.enrolledStudents || 0} students)
                        </span>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                        <span className="text-xl font-bold text-gray-800">
                            ${course.price || '0.00'}
                        </span>
                    </div>
                </div>

                {/* Duration */}
                {course.duration && (
                    <div className="mt-3 text-xs text-gray-500">
                        <span>⏱️ {course.duration} hours</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CourseCard;