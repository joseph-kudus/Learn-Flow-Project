import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import About from "./pages/About";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Footer from "./pages/Footer";
import Login from "./loginsignup/Login";
import Register from "./loginsignup/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./component/ProtectedRoute";
import "./App.css";

// Dashboard imports
import DashboardLayout from "./dashboard/Layout/DashboardLayout";
import DashboardMain from "./dashboard/Layout/DashboardMain";
import CreateCourse from "./dashboard/courses/CreateCourse";
import Courses from "./dashboard/courses/Courses";
import Coursebuilder from "./dashboard/courses/Coursebuilder";
import AllCourse from "./dashboard/courses/AllCourse";
import SettingsPage from "./dashboard/Layout/Sidebar/SettingsPage";
import Explore from "./dashboard/UserData/students/Explore";
import Achievement from "./dashboard/UserData/students/Achivement";
import Support from "./dashboard/UserData/Support";
import RecomendedCourse from "./dashboard/UserData/students/RecomendedCourses.jsx";
import LandingPage from "./pages/LandingPage";

/**
 * Layout: Wraps public pages with Navbar + Footer
 * Used for landing, about, login etc. NOT for dashboard
 */
function Layout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const { loading, currentUser } = useAuth();

  // Show loader while Firebase checks auth state
  if (loading) {
    return (
      <div className="animated-pulse text-indigo-600 text-xl">
        Loading Users data
      </div>
    );
  }

  return (
    <Routes>
      {/* === PUBLIC ROUTES === */}
      {/* If user is logged in, redirect to /dashboard. If not, show public page */}
      <Route
        path="/"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Layout>
              <LandingPage />
            </Layout>
          )
        }
      />
      <Route
        path="/landing"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Layout>
              <LandingPage />
            </Layout>
          )
        }
      />
      <Route
        path="/about"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Layout>
              <About />
            </Layout>
          )
        }
      />
      <Route
        path="/features"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Layout>
              <Features />
            </Layout>
          )
        }
      />
      <Route
        path="/support"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Layout>
              <Support />
            </Layout>
          )
        }
      />
      <Route
        path="/pricing"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Layout>
              <Pricing />
            </Layout>
          )
        }
      />
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Layout>
              <Login />
            </Layout>
          )
        }
      />
      <Route
        path="/register"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Layout>
              <Register />
            </Layout>
          )
        }
      />

      {/* === DASHBOARD ROUTES === */}
      {/* All routes inside here require login via ProtectedRoute */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* DashboardMain checks user.role and returns WelcomeStudent, WelcomeInstructor, or DashboardContent */}
        <Route index element={<DashboardMain />} />

        {/* Shared routes for all roles */}
        <Route path="allcourses" element={<AllCourse />} />
        <Route path="allcourses/course/:id" element={<Courses />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* Instructor routes - add role check inside Coursebuilder if needed */}
        <Route path="coursebuilder" element={<Coursebuilder />} />
        <Route path="coursebuilder/create" element={<CreateCourse />} />

        {/* Student/Learner routes */}
        <Route path="explore" element={<Explore />} />
        <Route path="recomendedcourse" element={<RecomendedCourse />} />
        <Route path="achievement" element={<Achievement />} />
        <Route path="support" element={<Support />} />
      </Route>

      {/* Catch all 404 - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}
