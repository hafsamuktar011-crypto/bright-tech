import { useState } from 'react'
import "../styles/register.css"
import api from "../api.js"

const initialFormData = {
  fullName: '',
  emailAddress: '',
  phone: '',
  birthDate: '',
  gender: '',
  academicBackground: '',
  password: '',
  confirmPassword: '',
}

function Register({ onSwitchToLogin, onRegisterSuccess }) {
  const [formData, setFormData] = useState(initialFormData)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...payload } = formData

    setLoading(true)
    try {
      const data = await api.register(payload)
      if (onRegisterSuccess) onRegisterSuccess(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <span className="auth-eyebrow">Student Portal</span>
        <h2>Create your account</h2>
        <p className="auth-subtitle">It only takes a couple of minutes to get started</p>

        <form onSubmit={handleSubmit}>

          <div className="form-section">
            <div className="form-section-title">Personal details</div>
            <div className="form-grid">
              <div className="input-group full-width">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="input-group full-width">
                <label>Academic Background</label>
                <input
                  type="text"
                  name="academicBackground"
                  placeholder="e.g. High school diploma, BSc in..."
                  value={formData.academicBackground}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Contact</div>
            <div className="form-grid">
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="emailAddress"
                  placeholder="@gmail.com"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="09xxxxxxxx"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Account security</div>
            <div className="form-grid">
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>{loading ? "Creating account..." : "Create Account"}</button>
        </form>

        <p className="signup">Already have an account?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); if (onSwitchToLogin) onSwitchToLogin() }}>Log in</a>
        </p>
      </div>
    </div>
  )
}

export default Register
