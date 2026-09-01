import { useState } from "react";
import "../styles/login.css"
import api from "../api.js"
import { useUserContext } from "../contexts/usercontext.jsx"

function Login({ onSwitchToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useUserContext()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.login(email, password)
      setUser(data.user)
      if (onLoginSuccess) onLoginSuccess(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">

      <div className="login-card">
        <span className="auth-eyebrow">Student Portal</span>
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Log in to continue to your dashboard</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email address</label>
            <input type="email" placeholder="@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <a href="#" className="forgot">Forgot password?</a>

          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Log In"}</button>
        </form>

        <p className="signup"> Are you new here?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); if (onSwitchToRegister) onSwitchToRegister() }}>Create an account</a>
        </p>

      </div>

    </div>
  );
}

export default Login;
