import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login logic
      if (email === 'admin@cvbuilder.com' && password === 'admin123') {
        setIsAuthenticated(true);
        // Store authentication in localStorage
        localStorage.setItem('cvBuilderAuth', 'true');
        // Trigger a custom event to notify App.js
        window.dispatchEvent(new CustomEvent('userAuthenticated'));
      } else {
        setError('Invalid email or password');
      }
    } else {
      // Signup logic
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      // For demo purposes, any signup will work
      setIsAuthenticated(true);
      localStorage.setItem('cvBuilderAuth', 'true');
      window.dispatchEvent(new CustomEvent('userAuthenticated'));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  if (isAuthenticated) {
    return null; // This component will be hidden when authenticated
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>CV Builder</h1>
          <p>{isLogin ? 'Sign in to your account' : 'Create your account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={toggleMode} className="toggle-button">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        <div className="demo-credentials">
          <h3>Demo Credentials:</h3>
          <p><strong>Email:</strong> admin@cvbuilder.com</p>
          <p><strong>Password:</strong> admin123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
