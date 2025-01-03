import React, { useEffect, useState } from "react";
import axios from "axios";
import PostForm from "./PostForm";
import PostList from "./PostList";

function DodajOglas() {
  const [posts, setPosts] = useState([]);

  // Pridobi objave ob nalaganju
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost/oglasna-deska-backend/get_posts.php");
      setPosts(response.data);
    } catch (error) {
      console.error("Napaka pri pridobivanju objav:", error);
    }
  };

  const addPost = async (post) => {
    try {
      await axios.post("http://localhost/oglasna-deska-backend/add_post.php", post);
      fetchPosts(); // Osveži seznam objav
    } catch (error) {
      console.error("Napaka pri dodajanju objave:", error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.post("http://localhost/oglasna-deska-backend/delete_post.php", { post_id: postId });
      fetchPosts(); // Osveži seznam objav
    } catch (error) {
      console.error("Napaka pri brisanju objave:", error);
    }
  };

  return (
  <div  style={{ justifyContent:"center",backgroundColor:"black", color:"white",height: '100vh',}}> 





    <div  style={{ justifyContent:"center",backgroundColor:"black", color:"white",height: '100vh',}}>
      <div style={{display: "flex", justifyContent:"center",backgroundColor:"black", color:"white",marginBottom:"20px"}}>
        <h1>DODAJ OGLAS </h1>        
      </div>

      <div style={{display: "flex", justifyContent:"center"}}>
          <PostForm onAddPost={addPost} />
          <PostList posts={posts} onDeletePost={deletePost} />
      </div>
    </div>
  </div>
  );
}

export default DodajOglas;
