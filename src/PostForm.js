import React, { useState } from "react";

function PostForm({ onAddPost }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [category_id, setCategoryId] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPost({ title, content, location, category_id });
    setTitle("");
    setContent("");
    setLocation("");
    setCategoryId(1);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Naslov objave" required />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Vsebina objave" required />
      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lokacija" />
      <input type="number" value={category_id} onChange={(e) => setCategoryId(e.target.value)} placeholder="Kategorija ID" />
      <button type="submit">Dodaj objavo</button>
    </form>
  );
}

export default PostForm;
