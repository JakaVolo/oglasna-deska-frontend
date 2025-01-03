import React from "react";
import PostForm from "./PostForm";

function DodajOglas({ userId }) {
  const addPost = async (post) => {
    try {
      const response = await fetch("http://localhost/oglasna-deska-backend/add_post.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, user_id: userId }),
      });
      const data = await response.json();
      if (data.status === "success") {
        alert("Oglas uspešno dodan!");
      } else {
        alert("Napaka pri dodajanju oglasa: " + data.message);
      }
    } catch (error) {
      console.error("Napaka pri dodajanju oglasa:", error);
      alert("Prišlo je do napake pri dodajanju oglasa.");
    }
  };

  return (
    <div style={{ backgroundColor: "black", color: "white", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Dodaj Oglas</h1>
      <PostForm onAddPost={addPost} />
    </div>
  );
}

export default DodajOglas;