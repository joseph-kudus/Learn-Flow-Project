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
import DashboardLayout from "./dashboard/Layout/DashboardLayout";

import LandingPage from "./pages/LandingPage";
import CreateCourse from "./dashboard/courses/CreateCourse";
import Courses from "./dashboard/courses/Courses";
import Coursebuilder from "./dashboard/courses/Coursebuilder";
import AllCourse from "./dashboard/courses/AllCourse";
import SettingsPage from "./dashboard/Layout/Sidebar/SettingsPage";
import DashboardContent from "./dashboard/Layout/DashboardContent";
import UseuserRole from "./dashboard/UserData/UseuserRole";
import WelcomePage from "./dashboard/UserData/students/WelcomePage";
import Explore from "./dashboard/UserData/students/Explore";
import Achievement from "./dashboard/UserData/students/Achivement";
import Support from "./dashboard/UserData/Support";
import RecomendedCourse from "./dashboard/UserData/students/RecomendedCourses.jsx";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animated-pulse text-indigo-600 text-xl">
          Loading Users data
        </div>
      </div>
    );
  }

  function RoleRoute({ children, allowedRole }) {
    const { user } = UseuserRole();
    if (user?.role !== allowedRole)
      return <Navigate to="/unauthorized" replace />;
    return children;
  }

  return (
    <Routes>
      {/* Public routes */}
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

      {/* Dashboard routes - nested */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardContent />} />

        <Route path="allcourses" element={<AllCourse />} />
        <Route path="allcourses/course/:id" element={<Courses />} />

        <Route path="coursebuilder" element={<Coursebuilder />} />
        <Route path="coursebuilder/create" element={<CreateCourse />} />

        <Route path="settings" element={<SettingsPage />} />

        {/*Student dashboard*/}
        <Route path="welcomepage" element={<WelcomePage />} />
        <Route path="explore" element={<Explore />} />
        <Route path="recomendedcourse" element={<RecomendedCourse/>} />
        <Route path="achievement" element={<Achievement />} />
        <Route path="support" element={<Support/>} />
      </Route>
      {/*Instructors only*/}
      <Route
        path="coursebuilder"
        element={
          <DashboardLayout>
            <RoleRoute allowedRole="instructor">
              <Coursebuilder />
            </RoleRoute>
          </DashboardLayout>
        }
      />
      {/*Students only*/}
      <Route
        path="course"
        element={
          <DashboardLayout>
            <RoleRoute allowedRole="instructor">
              <Courses />
            </RoleRoute>
          </DashboardLayout>
        }
      />
      <Route
        path="allcourse"
        element={
          <DashboardLayout>
            <RoleRoute allowedRole="student">
              <AllCourse />
            </RoleRoute>
          </DashboardLayout>
        }
      />
      <Route path="coursebuilder/create" element={<CreateCourse />} />
      {/* Catch all 404 */}
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
