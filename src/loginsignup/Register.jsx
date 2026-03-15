import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Notebook } from "lucide-react";
import "../pages/Page.css";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberme, setRememberMe] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !confirmpassword) {
      return setError("Please fill all the fields yoo");
    }
    if (password !== confirmpassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Password must be 6 characters");
    }
    if (rememberme) {
      localStorage.setItem("email:", email);
    }
    try {
      setLoading(true);
      await signup(email, password);
      navigate("/dashboard");
    } catch (err) {
      err.message;
      setError(
        "Fail to create account: " + (err.message || "Please try again"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <div className="Login-log flex items-center space-x-4 text-indigo-500">
          <Notebook className="h-12 w-12 text-indigo-50 md-2" />
          <p>LearnFlow</p>
        </div>

        <div>
          <div className="loginpage">
            <div className="Login-logo">
              <p>Welcome!</p>
              <h2>Sign up to</h2>
              <p>Lorem Ipsum is simply</p>
              <form onSubmit={handleSubmit}>
                <div className="Login-logo">
                  <label htmlFor="#">
                    Email:
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your  email"
                      required
                      className="inp"
                    />
                  </label>
                  <label htmlFor="#">
                    Username:
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your  name"
                      className="inp"
                    />
                  </label>
                  <label htmlFor="#">
                    Password:
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your Password"
                      className="inp"
                    />
                  </label>
                  <label htmlFor="#">
                    Confirm Password:
                    <input
                      type="password"
                      id="confirmpassword"
                      value={confirmpassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your Password"
                      className="inp"
                    />
                  </label>
                </div>
                <div>
                  <div>
                    <button
                      className="inpi" type="submit"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Register"}
                    </button>
                    <div>
                      <p className="texts-indigo-600">
                        Already have an Account ?{" "}
                        <Link to="/login" className="reg">
                          Login
                        </Link>
                      </p>
                    </div>
                    {error && (
                      <div className="bg-red-50 text-red-700 p-3 round-md mb-4 text-sm errorms">
                        {error}
                        {}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="team-discu">
        <h1>Team discu </h1>
      </div>
    </div>
  );
}
