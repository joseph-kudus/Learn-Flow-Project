import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Notebook, UserIcon } from "lucide-react";

import "../pages/Page.css";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [username] = useState();
  const [email] = useState();
  const [password] = useState();
  const [confirmpassword] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefualt();
    setError('');
    if (!email || !password || !confirmpassword) {
      return setError("Please fill all the fields");
    }

    if (password ==!confirmpassword) {
      return setError("Passwords do not match");
    }
    if (password.length <6) {
      return setError("Password must be 6 characters");
    }
    
    try {
      setLoading(true);
      await signup(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError('Fail to create account: ' + (err.message || 'Please try again'))
    }finally{
      setLoading(false)
    }

  }

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
              <form action="#" onSubmit={handleSubmit}>
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
                      required
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
                      required
                      className="inp"
                    />
                  </label>
                  <label htmlFor="#">
                    Confirm Password:
                    <input
                      type="password"
                      id="confirmpassword"
                      value={confirmpassword}
                      onChange={(e) => setconfirmpassword(e.target.value)}
                      placeholder="Confirm your Password"
                      required
                      className="inp"
                    />
                  </label>
                </div>
                <div>
                  <div>
                    <div className="checkbox">
                      <input type="checkbox" name="checkbox" id="" />
                      <p>Remember me</p>
                      <div className="forgot">
                        <p>Forgot Password?</p>
                      </div>
                    </div>
                    <button type="submit" className="inpi" disabled={loading}>
                      {loading ? "Register" : "Login"}
                    </button>
                    <div>
                      <p className="texts-indigo-600">
                        Don’t have an Account ?{" "}
                        <Link to="/login" className="reg">
                          Login
                        </Link>
                      </p>
                    </div>
                    {error && (
                      <div>
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
