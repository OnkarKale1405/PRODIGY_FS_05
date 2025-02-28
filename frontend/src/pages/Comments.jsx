import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Comments = () => {
  const { postId } = useParams(); // Get postId from URL parameter
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // Fetch the post details based on the postId
        const responsePost = await axios.get(`http://localhost:8000/api/v1/posts/${postId}`);
        setPost(responsePost.data);

        // Fetch comments for the post
        const responseComments = await axios.get(`http://localhost:8000/api/v1/comments/p/${postId}`);
        setComments(responseComments.data);
      } catch (error) {
        console.error('Error fetching post and comments:', error);
      }
    };

    fetchPostAndComments();
  }, [postId]); // Trigger fetch when postId changes

  return (
    <div>
    <Navbar />
    <div className="flex relative top-20 z-10">
      <div className="flex-none w-64">
        <Sidebar />
      </div>
      <div>
      {post && (
        <div>
          <h2>{post.caption}</h2>
          <img src={post.mediaFile[0]} alt="Post" />
        </div>
      )}

      {/* Text field for commenting */}
      <textarea placeholder="Write your comment..." />

      {/* Display existing comments */}
      <div>
        {comments.map((comment) => (
          <div key={comment._id}>
            <p>{comment.text}</p>
            <p>Posted by: {comment.username}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
    </div>
  );
}

export default Comments