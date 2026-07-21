import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Mylogin.css";
import { useAuth } from "../context/AuthContext";
import smte from "../assets/images/small-team.png";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, forgotPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be 6 characters or more");
      return;
    }

    try {
      setSubmitting(true);

      if (rememberMe) {
        localStorage.setItem("rememberEmail", cleanEmail);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      await login(cleanEmail, password, rememberMe);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgot = async () => {
    if (!email) {
      setError("Enter your email first");
      return;
    }

    try {
      await forgotPassword(email.trim());
      setError("Password reset email sent");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrap">
        <div className="login-content">
          <h1>Welcome!</h1>

          <h2>Sign in to your account</h2>

          <p className="subtitle">
            Top learning experiences that create more talent
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="inp"
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="inp"
                />

                <button
                  type="button"
                  className="eye-toggle"
                  aria-label="Show password"
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

            <button className="submit-btn" disabled={submitting}>
              {submitting ? "Signing in..." : "Login"}
            </button>

            <p className="register-text">
              Don't have an account?
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
