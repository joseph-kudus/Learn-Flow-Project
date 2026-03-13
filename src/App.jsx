import { HashRouter, BrowserRouter, Routes, Router, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Navbar from "./Navbar/Navbar";
import About from "./pages/About";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing"
import Footer from "./pages/Footer";
import Login from "./loginsignup/Login";
import Register from "./loginsignup/Register";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./component/Dashboard";
import ProtectedRoute from "./component/ProtectedRoute";

function App() {
  const { loading, currentUser } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animated-pulse text-indigo-600 text-xl">Loading Users data</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? <Navigate to="/dasboard" replace /> : <Landing />
          }
        />
        <Route
          path="/About"
          element={
            currentUser ? <Navigate to="/dasboard" replace /> : <About />
          }
        />
        <Route
          path="/features"
          element={
            currentUser ? <Navigate to="/dasboard" replace /> : <Features />
          }
        />
        <Route
          path="/pricing"
          element={
            currentUser ? <Navigate to="/dasboard" replace /> : <Pricing />
          }
        />
        <Route
          path="/login"
          element={
            currentUser ? <Navigate to="/dasboard" replace /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            currentUser ? <Navigate to="/dasboard" replace /> : <Register />
          }
        />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div>
              <Dashboard/>
            </div>
          </ProtectedRoute>
        }/>
      </Routes>
      <Footer />
    </div>
  );
}
export default App;
