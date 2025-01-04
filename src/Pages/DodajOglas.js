import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom"; 

function DodajOglas() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    location: "",
    category_id: "",
  });
  const [categories, setCategories] = useState([]); // Kategorije
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // Pridobivanje kategorij ob nalaganju
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost/oglasna-deska-backend/get_categories.php"
        );
        if (response.data.status === "success") {
          setCategories(response.data.categories); // Nastavi kategorije
        } else {
          console.error("Napaka pri pridobivanju kategorij:", response.data.message);
        }
      } catch (error) {
        console.error("Napaka pri pridobivanju kategorij:", error);
      }
    };

    fetchCategories();
  }, []);

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
        navigate("/");
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
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Izberite kategorijo
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="login-button">
            Dodaj Oglas
          </button>
        </form>
        {message && (
          <p className={error ? "error-message" : "success-message"}>{message}</p>
        )}
        <p>
           <Link to="/">Domov</Link>
        </p>
      </div>
    </div>
  );
}

export default DodajOglas;
