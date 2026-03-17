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
import Dashboard from "./dashboard/Dashboard";
import ProtectedRoute from "./component/ProtectedRoute";
import "./App.css";
import SettingsPage from "./dashboard/SettingsPage";
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
            path="/About"
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
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <div className="welcome-banner">
                  <h1>Welcome to Learnflow</h1>
                  <p>Learn at your own pace...</p>
                </div>
              }
            />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}
export default App;
