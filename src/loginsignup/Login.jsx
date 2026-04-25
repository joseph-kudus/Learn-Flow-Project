import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Notebook } from "lucide-react";
import "./Mylogin.css";
import { useAuth } from "../context/AuthContext";
import smte from "../assets/images/small-team.png";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Please fill all the fields");
    }

    if (password.length < 6) {
      return setError("Password must be 6 characters or more");
    }

    if (rememberMe) {
      localStorage.setItem("email", email); // removed colon from key
    } else {
      localStorage.removeItem("email");
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to login: " + (err.message || "Please try again"));
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) return setError("Enter email first");
    try {
      await forgotPassword(email);
      setError(""); // clear error
      alert("Check email for reset link");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrap">
        <Link to="/" className="login-logo-link">
          <Notebook size={24} />
          <p>LearnFlow</p>
        </Link>

        <div className="login-content">
          <h1>Welcome!</h1>
          <h2>Sign in to your account</h2>
          <p className="subtitle">
            Top learning experiences that create more talent
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="inp"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="inp"
                  required
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-btn"
                onClick={handleForgot}
              >
                Forgot Password?
              </button>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="register-text">
              Don't have an Account?{" "}
              <Link to="/register" className="reg-link">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="login-image">
        <img src={smte} alt="Team discussion" className="team-pic" />
      </div>
    </div>
  );
}
