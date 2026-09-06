import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

export default function RegisterAdmin() {
 const [formData, setFormData] = useState({
 name: "",
 email: "",
 password: "",
 });
 const [message, setMessage] = useState("");
 const [isSuccess, setIsSuccess] = useState(false);
 const [loading, setLoading] = useState(false);
 const navigate = useNavigate();

 const handleChange = (e) => {
 setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setMessage("");
 setLoading(true);

 try {
 const response = await axios.post(
 "http://localhost:5000/api/auth/register-admin",
 formData
);

setMessage(response.data.message , "Admin account successfully created!");
setIsSuccess(true);

 setTimeout(() => {
 navigate("/login");
 }, 2000);
 } catch (error) {
setIsSuccess(false);
 setMessage(
 error.response?.data?.message ,"Something went wrong during registration.");
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="register-page">
 <div className="register-card">
 <span className="register-eyebrow">Admin Portal</span>
 <h2>First Admin Setup</h2>
 <p className="register-subtitle">
 Initialize the system by registering the master administrator
 </p>

 <form onSubmit={handleSubmit}>
 <div className="register-formSection">
 <div className="register-sectionTitle">Account details</div>
 <div className="register-formGrid">
 <div className="register-inputGroup register-fullWidth">
 <label>Full Name</label>
 <input
 type="text"
 name="name"
 value={formData.name}
 onChange={handleChange}
 placeholder="Enter admin name"
 required
 />
 </div>

 <div className="register-inputGroup register-fullWidth">
 <label>Email Address</label>
 <input
 type="email"
 name="email"
 value={formData.email}
 onChange={handleChange}
 placeholder="admin@example.com"
 required
 />
 </div>

 <div className="register-inputGroup register-fullWidth">
 <label>Password</label>
 <input
 type="password"
 name="password"
value={formData.password}
 onChange={handleChange}
 placeholder="At least 6 characters"
 required
 />
 </div>
 </div>
 </div>

 {message && (
 <p className={isSuccess ? "register-success" : "register-error"}>
 {message}
 </p>
 )}

 <button type="submit" className="register-submit" disabled={loading}>
 {loading ? "Creating admin..." : "Create Master Admin"}
 </button>
</form>
 <p className="register-footer">
 Already have an account? <Link to="/login">Log in</Link>
 </p>
 </div>
 </div>
);
}