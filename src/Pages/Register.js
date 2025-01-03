import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset message
    setError(false);
  
    if (formData.password !== formData.confirmPassword) {
      setMessage("Gesli se ne ujemata.");
      setError(true);
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost/oglasna-deska-backend/register.php",
        formData,
        { withCredentials: true } // Za podporo sej
      );
      setMessage(response.data.message);
      if (response.data.status === "success") {
        console.log("Registracija uspešna:", response.data.user);
        navigate("/login");
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Napaka pri registraciji:", error);
      if (error.response && error.response.status === 409) {
        setMessage("Uporabniško ime ali e-pošta že obstajata.");
      } else {
        setMessage("Prišlo je do napake. Poskusite znova.");
      }
      setError(true);
    }
  };
  

  return (
    
    <div style={{paddingTop:"5%"}}>
    <div className="login-container">
      <h1>Registracija</h1>
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
        <div className="form-group">
          <label htmlFor="confirmPassword">Potrdi geslo:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Registracija
        </button>
      </form>
      {message && <p className={error ? "error-message" : "success-message"}>{message}</p>}
    </div>
    </div>
  );
}

export default Register;
