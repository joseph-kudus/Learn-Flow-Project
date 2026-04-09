import { Routes, Route, Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Landing from "./pages/Landing";
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
import AllCourse from "./dashboard/courses/AllCourse";
import DashboardLayout from "./dashboard/Layout/DashboardLayout";
import DashboardContent from "./dashboard/Layout/DashboardContent";
import Support from "./dashboard/Layout/Sidebar/Support";

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
                <Navigate to="/dashboard" />
              ) : (
                <Layout>
                  <Landing />
                </Layout>
              )
            }
          />
          <Route
            path="/landing"
            element={
              currentUser ? (
                <Navigate to="/dashboard" />
              ) : (
                <Layout>
                  <Landing />
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
                <Navigate to="/Dashboard" replace />
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
                <Navigate to="/dashboard" />
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
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardContent />} />
          </Route>
          <Route
            path="/allcourses"
            element={
              <ProtectedRoute>
                <AllCourse />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}
export default App;
