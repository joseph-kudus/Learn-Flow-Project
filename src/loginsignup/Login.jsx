import React from 'react'
import { Link, Notebook } from 'lucide-react'
import "../pages/Page.css";

export default function Login() {
  const email = "";
  const password = "";
  
  return (
    <div>
      <div>
        <div>
          <div className="loginpage">
            <div className="Login-logo">
              <div className="Login-log flex items-center space-x-4 text-indigo-500">
                <Notebook className="h-12 w-12 text-indigo-50 md-2" />
                <p>LearnFlow</p>
              </div>
              <p>Welcome!</p>
              <h2>Sign in to</h2>
              <p>Lorem Ipsum is simply</p>
              <form action="#">
                <div>
                  <label htmlFor="#">
                    Username:
                    <input
                      type="email"
                      id="email"
                      value={email}
                      placeholder="Enter your user name"
                      required
                    />
                  </label>
                </div>
                <div>
                  <label htmlFor="#">
                    Password:
                    <input
                      type="password"
                      id="password"
                      value={password}
                      placeholder="Enter your user Password"
                      required
                    />
                  </label>
                  <div className="checkbox">
                    <input type="checkbox" name="checkbox" id="" />
                    <p>Remember me</p>
                    <div className="forgot">
                      <p>Forgot Password?</p>
                    </div>
                  </div>
                </div>
                <button type="submit">Log</button>
                <div>
                  <p>Don't have an account yet?</p>
                </div>
                <div>
                  <Link to="/Register">Register</Link>
                </div>
              </form>
              <div></div>
            </div>
          </div>
          <div className='discat'>
            <Link to="../asset"></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
