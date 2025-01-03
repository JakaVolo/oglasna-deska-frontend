import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // State to track selected category

  // Fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost/oglasna-deska-backend/get_posts.php");
      setPosts(response.data);

      // Extract unique categories from the posts
      const uniqueCategories = [
        ...new Set(response.data.map((post) => post.category_name))
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Napaka pri pridobivanju objav:", error);
    }
  };

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Filtered posts based on selected category
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category_name === selectedCategory)
    : posts;

  return (
    <div className="container">
    <div className="header">
      <h1 style={{ fontSize: "300%" }}>Objave</h1>
      <a href="/login" className="login-link">Login</a>
    </div>
  
    {/* Category Buttons */}
    <div className="categories">
      <button
        className="category-button"
        onClick={() => setSelectedCategory(null)}
        style={{ fontWeight: selectedCategory === null ? "bold" : "normal" }}
      >
        Vse kategorije
      </button>
      {categories.map((category, index) => (
        <button
          key={index}
          className="category-button"
          onClick={() => setSelectedCategory(category)}
          style={{ fontWeight: selectedCategory === category ? "bold" : "normal" }}
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
            <p><strong>Lokacija:</strong> {post.location}</p>
            <p><strong>Datum in čas objave:</strong> {new Date(post.date_time).toLocaleString()}</p>
            <p><strong>Avtor:</strong> {post.username}</p>
            <hr />
          </div>
        ))
      ) : (
        <p>Trenutno ni objav.</p>
      )}
    </div>
  </div>
    

  );
}

export default App;
