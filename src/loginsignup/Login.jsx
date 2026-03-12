import React from 'react'
import { Link } from 'react-router-dom';
import { Notebook, UserIcon } from 'lucide-react'
import "../pages/Page.css";

export default function Login() {
  const email = "";
  const password = "";
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
              <h2>Sign in to</h2>
              <p>Lorem Ipsum is simply</p>
              <form action="#">
                <div className="Login-logo">
                  <label htmlFor="#">
                    Username:
                    <input
                      type="email"
                      id="email"
                      value={email}
                      placeholder="Enter your user name"
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
                      placeholder="Enter your user Password"
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
                    <button type="submit" className='inpi'>Login</button>
                    <div>
                      <p className="texts-indigo-600">
                        Don’y have an Account ?{" "}
                        <Link to="/register" className='reg'>Register</Link>
                      </p>
                    </div>
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
