import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard'; // Import the PostCard component
import CreatePost from './CreatePost'; // Import the CreatePost component

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found');
        }

        const response = await axios.get('http://localhost:8000/api/v1/posts/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const fetchedPosts = response.data.data; // Access the 'data' array from the response
        setPosts(fetchedPosts);
        console.log('Posts fetched successfully:', fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts(); // Call the fetchPosts function when the component mounts
  }, []); // Empty dependency array means this effect runs only once after mount

  const updatePosts = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const response = await axios.get('http://localhost:8000/api/v1/posts/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const fetchedPosts = response.data.data; // Access the 'data' array from the response
      setPosts(fetchedPosts);
      console.log('Posts updated successfully:', fetchedPosts);
    } catch (error) {
      console.error('Error updating posts:', error);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <CreatePost updatePosts={updatePosts}/>
      {Array.isArray(posts) &&
        posts.map(post => (
          <PostCard key={post._id} post={post} updatePosts={updatePosts} />
        ))}
    </div>
  );
};

export default Posts;
