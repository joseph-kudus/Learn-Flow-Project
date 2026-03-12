import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Notebook, UserIcon } from 'lucide-react'
import "../pages/Page.css";

export default function Login() {
    const [email] = useState();
    const [password] = useState();
  return (
    <div className="login-container">
      <div className="login-logo">
        <div className="Login-log flex items-center space-x-4 text-indigo-500">
          <Notebook className="h-12 w-12 text-indigo-50 md-2" />
          <p>LearnFlow</p>
        </div>

        <div>
          <div>
            <Notebook className="h-12 w-12 text-indigo-50 md-2" />
            <h2>Welcome Back</h2>
            <p>Signin to access your course</p>
            <form action="#">
              <div>
                <label htmlFor="#">
                  Email:
                  <input
                    type="email"
                    id="email"
                    value={email}
                    placeholder="you@example.com"
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
                    placeholder="******"
                    required
                  />
                </label>
              </div>
              <button type='submit'>Submit</button>
              <div >
                <p className='text-gray-600'>Don't have an account?</p>
                <Link to="/Register">Register</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
