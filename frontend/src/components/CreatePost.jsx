import React, { useState } from "react";
import axios from "axios";

const CreatePost = ({ updatePosts }) => {
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setCaption(""); // Reset caption state when closing modal
    setFiles([]); // Reset files state when closing modal
  };

  const handleCaptionChange = (e) => setCaption(e.target.value);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const formData = new FormData();
      formData.append("caption", caption);
      files.forEach((file) => formData.append("mediaFile", file));

      const response = await axios.post(
        "http://localhost:8000/api/v1/posts/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Post created successfully:", response.data);
      updatePosts(); // Trigger posts update after successful creation
      closeModal(); // Close the modal after successful post creation
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <>
      <button
        className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={openModal}
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "15px 30px",
          cursor: "pointer",
          textDecoration: "none",
          marginLeft: "200px",
        }}
      >
        Create Post
      </button>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Create Post</h3>
            <form className="w-full max-w-lg" onSubmit={handlePostSubmit}>
              <textarea
                className="w-full border rounded-md p-2 mb-4"
                placeholder="What's on your mind?"
                value={caption}
                onChange={handleCaptionChange}
              ></textarea>
              <input
                type="file"
                className="mb-4"
                multiple
                onChange={handleFileChange}
              />
              <div className="flex justify-end">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePost;
