import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Notebook } from "lucide-react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import "./Mylogin.css";
import smte from "../assets/images/small-team.png";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signup, sendEmailVerification } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !email || !password || !confirmPassword) {
      return setError("Please fill all the fields");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Password must be 6 characters or more");
    }
    if (!acceptTerms) {
      return setError("You must accept the terms and conditions");
    }

    try {
      setLoading(true);
      const userCredential = await signup(email, password, username);

      // Send verification email
      if (sendEmailVerification) {
        await sendEmailVerification(userCredential.user);
        setSuccess("Account created! Check your email to verify your account.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        "Failed to create account: " + (err.message || "Please try again"),
      );
    } finally {
      setLoading(false);
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
          <h2>Sign up to get started</h2>
          <p className="subtitle">Join thousands learning with us today</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="inp"
                required
              />
            </div>

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

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-wrap">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="inp"
                  required
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                </button>
              </div>
            </div>

            <label className="checkbox-label terms-check">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                required
              />
              <span>
                I agree to the{" "}
                <Link to="/terms" className="terms-link">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="terms-link">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {error && <div className="error-msg">{error}</div>}
            {success && <div className="success-msg">{success}</div>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Register"}
            </button>

            <p className="register-text">
              Already have an Account?
              <Link to="/login" className="reg-link">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="login-image">
        <img src={smte} alt="Team discussion" className="team-pic"/>
        
      </div>
    </div>
  );
}
