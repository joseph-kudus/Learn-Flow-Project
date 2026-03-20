import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Notebook } from "lucide-react";
import "./Mylogin.css";
import { useAuth } from "../context/AuthContext";
import smte from "../assets/images/small-team.png";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberme, setRememberMe] = useState("");
  const { login, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      return setError("Please fill all the fields yoo");
    }

    if (password.length < 6) {
      return setError("Password must be 6 characters");
    }
    if (rememberme) {
      localStorage.setItem("email:", email);
    }
    try {
      setLoading(true);
      await login(email, password);
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
  const handleForgot = async () => {
    if (!email) return alert("Enter email first");
    try {
      await forgotPassword(email);
      alert("Check email for reset link");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <div>
          <div className="loginpage">
            <div className="Login-logo">
              <p>Welcome!</p>
              <h2>Sign in to</h2>
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
                </div>
                <div>
                  <div>
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        checked={rememberme}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <p>Remember me</p>
                      <div className="forgot">
                        <button type="reset">
                          <p
                            onClick={handleForgot}
                            style={{ cursor: "pointer" }}
                          >
                            Forgot Password?
                          </p>
                        </button>
                      </div>
                    </div>
                    <button type="submit" className="inpi" disabled={loading}>
                      {loading ? "Register" : "Login"}
                    </button>
                    <div>
                      <p className="texts-indigo-600">
                        Don’t have an Account?{" "}
                        <Link to="/register" className="reg">
                          Register
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
        <img src={smte} alt="" className="team-pic" />
      </div>
    </div>
  );
}
