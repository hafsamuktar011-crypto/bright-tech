import { useState } from "react"
import api from "../../api"


function RegisterStaff() {
    const [formData,setFormData]=useState({
        fullName:"",
        emailAddress:"",
        phone:"",
        birthDate:"",
        gender:"male",
        academicBackground:"",
        selectSupportType:["Online"],
        password:"",
        role:"instructor",
    })
    const [message,setMessage] =useState("")
    const [error,setError] =useState("")
    const handleChange =(e) => {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value,
        })
    }
    const handleSubmit =async (e) =>{
        e.preventDefault();
        setMessage("")
        setError("")
        try {
            const res=await api.registerStaff(formData)
            setMessage(res.message || "Staff registered successfully!")
            setFormData({
                fullName:"",
        emailAddress:"",
        phone:"",
        birthDate:"",
        gender:"male",
        academicBackground:"",
        selectSupportType:["Online"],
        password:"",
        role:"instructor",
            })
        } catch (error) {
            setError(error.message || "Registration failed")
        }
    }
  return (
    <div>
        <h2>Register Staff</h2>
        {message && <p style={{color:"green"}}>{message}</p>}
        {error && <p style={{color:"red"}}>{error}</p>}
        <form onSubmit={handleSubmit}>
         <div>
            <label>Full Name:</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
         </div>
          <div>
            <label>Email Address:</label>
            <input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleChange} required />
         </div>
          <div>
            <label>Phone:</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+251..." required />
         </div>
          <div>
            <label>Birth Date:</label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
         </div>
         <div>
            <label>Gender:</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>

            </select>
         </div>
          <div>
            <label>Academic Background:</label>
            <input type="text" name="academicBackground" value={formData.academicBackground} onChange={handleChange} required />
         </div>
          <div>
            <label>Support Type:</label>
            <select name="selectSupportType" value={formData.selectSupportType} onChange={handleChange}>
                <option value="Online">Online</option>
                <option value="In-person">In-Person</option>
                <option value="Both">Online & In-Person</option>
                
            </select>
         </div>
         <div>
            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="registrar">Registrar</option>
                <option value="finance">Finance</option>
                <option value="admin">Admin</option>
            </select>
         </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
         </div>
         <button type="submit">Register Staff Member</button>
        </form>

    </div>
  )
}

export default RegisterStaff