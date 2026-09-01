import { useState } from 'react'
import './App.css'
import Login from "./pages/login.jsx"
import Register from "./pages/register.jsx"
import Homepage from "./pages/homepage.jsx"
import { UserContextProvider, useUserContext } from "./contexts/usercontext.jsx"
import api from "./api.js"
import RegisterStaff from './pages/Admin/RegisterStaff.jsx'

// Note: react-router-dom isn't installed in this project (and this
// environment has no network access to add it), so navigation between
// Login / Register / a logged-in view is handled with simple state here.
function AppContent() {
  const [view, setView] = useState('home')
  const { state, setUser } = useUserContext()

  const handleLogout = async () => {
    try {
      await api.logout()
    } catch {
      // ignore network errors on logout, clear local state regardless
    }
    setUser(null)
    setView('home')
  }

  if (state.user) {
    return (
      <div className="logged-in">
        <h1>Welcome, {state.user.emailAddress}</h1>
        <p>Role: {state.user.role}</p>
        <button onClick={handleLogout}>Log out</button>
        {state.user.role==="admin"&&(
          <div style={{marginTop:"20px"}}>
            <RegisterStaff/>
          </div>
        )}
      </div>
    )
  }

  if (view === 'login') {
    return (
      <Login
        onSwitchToRegister={() => setView('register')}
        onLoginSuccess={() => setView('home')}
      />
    )
  }

  if (view === 'register') {
    return (
      <Register
        onSwitchToLogin={() => setView('login')}
        onRegisterSuccess={() => setView('login')}
      />
    )
  }

  return <Homepage onSignupClick={() => setView('login')} />
}

function App() {
  return (
    <UserContextProvider>
      <AppContent />
    </UserContextProvider>
  )
}

export default App
