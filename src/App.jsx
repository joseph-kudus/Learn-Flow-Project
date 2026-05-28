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
import Support from "./dashboard/Layout/Sidebar/Support";
import LandingPage from "./pages/LandingPage";
import CreateCourse from "./dashboard/courses/CreateCourse";
import Courses from "./dashboard/courses/Courses";

function App() {
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

  function Layout({ children }) {
    return (
      <div>
        <Navbar />
        {children}
        <Footer />
      </div>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50">
        <Routes>
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
          <Route
            path="/coursebuilder/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <CreateCourse />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Courses list */}
          <Route
            path="/allcourses"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
          
          {/* Single course view */}
          <Route
            path="/allcourses/course/:id"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          
          {/* Dashboard home */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
          
          {/* Catch all 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
export default App;