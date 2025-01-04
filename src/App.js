import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import "./styles/App.css";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import DodajOglas from "./Pages/DodajOglas";

function App() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost/oglasna-deska-backend/get_posts.php"
      );
      setPosts(response.data);

      const uniqueCategories = [
        ...new Set(response.data.map((post) => post.category_name)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Napaka pri pridobivanju objav:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  const deletePost = async (postId) => {
    try {
      const userId = localStorage.getItem("user_id"); // Pridobi ID uporabnika
      const role = localStorage.getItem("role"); // Pridobi vlogo uporabnika (npr. 'admin' ali 'user')
  
      const response = await axios.post(
        "http://localhost/oglasna-deska-backend/delete_post.php",
        { post_id: postId, user_id: userId, role: role }
      );
  
      if (response.data.status === "success") {
        alert(response.data.message);
        fetchPosts(); // Osveži objave
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Napaka pri brisanju objave:", error);
      alert("Napaka pri brisanju objave.");
    }
  };
  
  const confirmDelete = (postId) => {
    if (window.confirm("Ali ste prepričani, da želite izbrisati to objavo?")) {
      deletePost(postId);
    }
  };
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category_name === selectedCategory)
    : posts;

  return (
    <Routes>
      {/* Prijavna stran */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/oglas" element={<DodajOglas />} />

      {/* Glavna stran */}
      <Route
        path="/"
        element={
          <div className="container">
            <div className="header">
              <h1 style={{ fontSize: "300%" }}>Objave</h1>
              <Link to="/login" className="login-link">
                Login
              </Link>
              <Link to="/oglas" className="objava-link">
                Nova objava
              </Link>
            </div>

            <div className="categories">
              <button
                className="category-button"
                onClick={() => setSelectedCategory(null)}
                style={{
                  fontWeight: selectedCategory === null ? "bold" : "normal",
                }}
              >
                Vse kategorije
              </button>
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="category-button"
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    fontWeight:
                      selectedCategory === category ? "bold" : "normal",
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="posts">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div className="post" key={post.post_id}>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <p>
                      <strong>Lokacija:</strong> {post.location}
                    </p>
                    <p>
                      <strong>Datum in čas objave:</strong>{" "}
                      {new Date(post.date_time).toLocaleString()}
                    </p>
                    <p>
                      <strong>Avtor:</strong> {post.username}
                    </p>
                    <hr />
                    
                    {(localStorage.getItem("role") === "moderator" || 
                    localStorage.getItem("user_id") === post.user_id.toString()) && (
                    <button
                      type="submit"
                      className="brisi-button"
                      onClick={() => confirmDelete(post.post_id)}
                    >
                      Izbriši
                    </button>
                  )}

                  </div>
                ))
              ) : (
                <p>Trenutno ni objav.</p>
              )}
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
