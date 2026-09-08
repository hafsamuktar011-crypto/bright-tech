import { BrowserRouter ,Routes ,Route ,Navigate } from 'react-router-dom'
import './App.css'
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Homepage from "./pages/Homepage.jsx"
import { UserContextProvider } from "./contexts/usercontext.jsx"
import RegisterStaff from './pages/Admin/RegisterStaff.jsx'
import About from './pages/About.jsx'
import Courses from "./pages/Courses.jsx"
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import StudentsList from './pages/Admin/StudentsList.jsx'
import ManageCourses from './pages/Admin/ManageCourses.jsx'
import PaymentManagement from './pages/Admin/PaymentManagement.jsx'
import Footer from './components/Footer.jsx'
import WelcomePage from './pages/WelcomePage/welcomePage.jsx'
import ForgotPassword from './components/ForgotPassword.jsx'
import RegisterAdmin from './pages/RegisterAdmin.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function AppContent() {
    return (
      <>
      <div className="app-main">
      <Routes >
        {/* {main Homepage Route} */}
        <Route path="/" element={<Homepage/>} />
        {/* {Public Page} */}
        <Route path='/about' element={<About/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/courses' element={<Courses/>}/>
        <Route path='/Courses' element={<Courses/>}/>
        {/* {Authentication Pages} */}
        <Route path='/welcome' element={<WelcomePage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/register-admin' element={<RegisterAdmin/>}/>
        {/* {Admin Page} */}
        <Route path='/admin' element={
          <ProtectedRoute>
            <AdminDashboard/>
          </ProtectedRoute>
          }>
          <Route index element={<Navigate to="students" replace/>}/>
          <Route path='register-staff' element={<RegisterStaff/>}/>
          <Route path='students' element={<StudentsList/>}/>
          <Route path='payments' element={<PaymentManagement/>}/>
          <Route path='courses' element={<ManageCourses/>}/>
            </Route>
        
        {/* {Catch-all redirect back to home} */}
        <Route path='*' element={<Navigate to="/" replace/>}/>
      </Routes>
      </div>
      <Footer />
      </>
    );
  }

  function App() {
  return (
    <BrowserRouter>
    <UserContextProvider>
      <AppContent />
    </UserContextProvider>
    </BrowserRouter>
  )
}

export default App
