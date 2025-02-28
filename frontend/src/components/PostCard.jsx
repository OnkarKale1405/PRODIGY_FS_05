import React, { useState } from "react";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import defaultImage from "../assets/profile-img.jpg";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axios from "axios";

const PostCard = ({ post, updatePosts }) => {
  const history = useNavigate();
  const {
    _id,
    mediaFile,
    caption,
    postedBy,
    numberOfLikes,
    numberOfComments,
    hasUserLikedPost,
  } = post;
  const { username, name, profilepic } = postedBy;

  const postImg = mediaFile && mediaFile.length > 0 ? mediaFile[0] : null;
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState(""); // Initialize comment state

  const handleCommentClick = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await axios.get(
        `http://localhost:8000/api/v1/comments/p/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      setComments(response.data.data); // Assuming response.data is an array of comments
      console.log(comments);
      setIsCommentModalOpen(true);
    } catch (error) {
      if(error.response.data.includes("Not Found"))
      {
        setIsCommentModalOpen(true);
      }
      else{
        console.error("Error fetching comments:", error.response.data);
      }
    }
  };

  const handleLikeClick = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await axios.post(
        `http://localhost:8000/api/v1/likes/p/${_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Post liked successfully:", response.data);
      window.alert("Comment Like toggled successfully !")
      // Update posts after like action
      updatePosts();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCommentLikeClick = async (cId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await axios.post(
        `http://localhost:8000/api/v1/likes/c/${cId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Comment liked successfully:", response.data);
      handleCommentClick();
      window.alert("Comment Like toggled successfully !")
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleSubmitComment = async () => {
    // Send comment to the server and update comments after successful submission
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await axios.post(
        `http://localhost:8000/api/v1/comments/p/${_id}`,
        { content: comment },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Comment posted successfully:", response.data);
      handleCommentClick();
      // Update comments after comment submission
      // You may fetch updated comments here or use the existing state
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div
      className="p-5 mb-10 mt-8 w-[35vw] h-[90vh] rounded-2xl border-2"
      style={{ position: "relative" }}
    >
      <div className="flex flex-row items-center mb-5 ml-8">
        <img
          src={profilepic || defaultImage}
          alt="User avatar"
          className="w-12 h-12 rounded-full cursor-pointer"
          onClick={() => history(`/profile/${username}`)}
        />
        <h3 className="ml-2 text-black">@{username || "Unknown"}</h3>
      </div>

      <div className="h-3/4 flex justify-center">
        {postImg ? (
          <img src={postImg} alt="Post Image" className="rounded-md h-full " />
        ) : (
          <div className="h-full bg-slate-100"></div>
        )}
      </div>

      <div className="post-icons flex ml-4 mt-2">
        <div
          className="icon-wrapper mr-6 flex flex-row"
          onClick={handleLikeClick}
          style={{ cursor: "pointer" }}
        >
          {numberOfLikes}
          {hasUserLikedPost ? (
            <FaThumbsUp className="ml-2 text-red-500" size={24} />
          ) : (
            <FaThumbsUp className="ml-2" size={24} />
          )}
        </div>
        <div
          className="icon-wrapper mr-6 flex flex-row"
          onClick={handleCommentClick}
          style={{ cursor: "pointer" }}
        >
          {numberOfComments} <FaComment className="ml-2" size={24} />
        </div>
        <div className="icon-wrapper">
          <FaShare size={24} />
        </div>
      </div>

      <div className="textbody ml-4">
        <p className="mt-4">{caption}</p>
      </div>

      {/* Comment Modal */}
      {isCommentModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 35,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(10px) hue-rotate(90deg)",
              zIndex: 49,
            }}
          ></div>
          <div
            style={{
              backgroundColor: "white",
              paddingLeft: "32px",
              paddingRight: "32px",
              paddingTop: "16px",
              paddingBottom: "16px",
              borderRadius: "8px",
              zIndex: 90,
            }}
          >
            <div className="flex flex-row items-center mb-5 ml-8">
              <img
                src={profilepic || defaultImage}
                alt="User avatar"
                className="w-12 h-12 rounded-full"
              />
              <h3 className="ml-2 text-black">@{username || "Unknown"}</h3>
            </div>

            <div className="h-3/4 flex justify-center">
              {postImg ? (
                <img
                  src={postImg}
                  alt="Post Image"
                  className="rounded-md h-60 w-80"
                />
              ) : (
                <div></div>
              )}
            </div>
            <div>
              {comments && Array.isArray(comments) && (
                <div className="max-h-32 mt-2 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment._id} className="flex w-full items-center">
                      <div
                        className="w-12 h-12 mr-2 mt-1 mb-1 border-b border-red-400 rounded-full"
                        onClick={() =>
                          history(
                            `/profile/${
                              comment.commentedBy.username ||
                              comment.commentedBy[0].username
                            }`
                          )
                        }
                      >
                        <img
                          src={
                            comment.commentedBy.profilepic ||
                            comment.commentedBy[0]?.profilepic ||
                            "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                          }
                          alt=""
                          className="rounded-full h-12 w-12"
                        />
                      </div>
                      <div className="w-48">
                        <div
                          onClick={() =>
                            history(
                              `/profile/${
                                comment.commentedBy.username ||
                                comment.commentedBy[0].username
                              }`
                            )
                          }
                        >
                          @
                          {comment.commentedBy.username ||
                            comment.commentedBy[0].username}
                        </div>
                        <div className="font-semibold">
                          {comment.content || comment.content}
                        </div>
                      </div>
                      <div className="pl-8 pt-4">
                        <span
                          onClick={() => handleCommentLikeClick(comment._id)}
                        >
                          {comment.hasUserLikedComment ? (
                            <FavoriteIcon />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </span>
                        <span>{comment.numberOfLikes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Add a Comment
            </h2>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: "100%",
                height: "4rem",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginBottom: "0.5rem",
              }}
              placeholder="Write your comment..."
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  updatePosts();
                  setIsCommentModalOpen(false);
                  setComment("");
                }}
                style={{
                  backgroundColor: "#ccc",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  marginRight: "8px",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitComment}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "4px",
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;