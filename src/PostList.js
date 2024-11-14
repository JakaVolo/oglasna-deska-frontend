import React from "react";

function PostList({ posts, onDeletePost }) {
  return (
    <div >
      {posts.map((post) => (
        <div key={post.post_id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>Lokacija: {post.location}</p>
          <p>Objavil: {post.username} ob {post.date_time}</p>
          <p>Kategorija: {post.category_name}</p>
          <button onClick={() => onDeletePost(post.post_id)}>Izbriši</button>
        </div>
      ))}
    </div>
  );
}

export default PostList;
