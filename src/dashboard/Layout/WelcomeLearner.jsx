import { Link } from "react-router-dom";

const WelcomeLearner = ({ user }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome to LearnFlow, {user.name}!</h1>
      <p className="text-gray-600 mt-2">Start your learning journey today.</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Explore Free Courses</h2>
        {/* Map your free courses here */}
        <Link
          to="/courses"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Browse All Courses
        </Link>
      </div>
    </div>
  );
};
export default WelcomeLearner;
