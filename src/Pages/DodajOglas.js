import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

function DodajOglas() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    location: "",
    category_id: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

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
        "http://localhost/oglasna-deska-backend/add_post.php",
        formData,
        { withCredentials: true }
      );
      setMessage(response.data.message);
      if (response.data.status === "success") {
        console.log("Oglas uspešno dodan:", response.data.post);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Napaka pri dodajanju oglasa:", error);
      setMessage("Prišlo je do napake. Poskusite znova.");
      setError(true);
    }
  };

  return (
    <div style={{ paddingTop: "5%" }}>
      <div className="login-container">
        <h1>Dodaj Oglas</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Naslov:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Vsebina:</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Lokacija:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category_id">Kategorija:</label>
            <input
              type="number"
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Dodaj Oglas
          </button>
        </form>
        {message && (
          <p className={error ? "error-message" : "success-message"}>{message}</p>
        )}
      </div>
    </div>
  );
}

export default DodajOglas;
