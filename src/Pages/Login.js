import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom"; 

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); 
    setError(false);
  
    try {
      const response = await axios.post(
        "http://localhost/oglasna-deska-backend/login.php",
        formData,
        { withCredentials: true }
      );
      setMessage(response.data.message);
  
      if (response.data.status === "success") {
        const { user_id, role } = response.data.user;
        
        
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("role", role);
        
        navigate("/");
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Napaka pri prijavi:", error);
      setMessage("Prišlo je do napake. Poskusite znova.");
      setError(true);
    }
  };
  

  return (
    <div style={{ paddingTop: "5%" }}>
      <div className="login-container">
        <h1>Prijava</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Uporabniško ime:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-pošta:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Geslo:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Prijava
          </button>
        </form>
        {message && <p className={error ? "error-message" : "success-message"}>{message}</p>}
        <p>
          Nimate računa? <Link to="/register">Registrirajte se tukaj</Link>
          
        </p>
        <p><Link to="/">Domov</Link></p>
      </div>
    </div>
  );
}

export default Login;
