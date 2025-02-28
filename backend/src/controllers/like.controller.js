import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../models/like.models.js";
import { Post } from "../models/post.models.js";
import { Comment } from "../models/comment.models.js";
import { Reply } from "../models/reply.models.js";
import mongoose from "mongoose";

const togglePostLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.isValidObjectId(postId)) {
    throw new ApiError(404, "Invalid Post Id");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "post does not exist");
  }

  const likeObject = {
    likedBy: req?.user,
    post: post,
  };
  const hasUserLikedBefore = await Like.findOne(likeObject);

  let toggledLike;
  let message;
  if (!hasUserLikedBefore) {
    toggledLike = await Like.create(likeObject);

    const likedVideo = await Like.aggregate([
      {
        $match: {
          _id: toggledLike._id,
        },
      },
    ]);

    toggledLike = likedVideo;
    message = "Post liked successfully";
  } else {
    toggledLike = await Like.findOneAndDelete(likeObject);
    message = "Like removed from post successfully";
  }

  return res.status(200).json(new ApiResponse(200, toggledLike, message));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(404, "Invalid Comment Id");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "comment does not exist");
  }

  const likeObject = {
    likedBy: req?.user,
    comment: comment,
  };
  const hasUserLikedBefore = await Like.findOne(likeObject);

  let toggledLike;
  let message;
  if (!hasUserLikedBefore) {
    toggledLike = await Like.create(likeObject);

    const likedComment = await Like.aggregate([
      {
        $match: {
          _id: toggledLike._id,
        },
      },
    ]);

    toggledLike = likedComment;
    message = "Comment liked successfully";
  } else {
    toggledLike = await Like.findOneAndDelete(likeObject);
    message = "Like removed from comment successfully";
  }

  return res.status(200).json(new ApiResponse(200, toggledLike, message));
});

const toggleReplyLike = asyncHandler(async (req, res) => {
  const { replyId } = req.params;

  if (!mongoose.isValidObjectId(replyId)) {
    throw new ApiError(404, "Invalid Reply Id");
  }

  const reply = await Reply.findById(replyId);
  if (!reply) {
    throw new ApiError(404, "reply does not exist");
  }

  const likeObject = {
    likedBy: req?.user,
    reply: reply,
  };
  const hasUserLikedBefore = await Like.findOne(likeObject);

  let toggledLike;
  let message;
  if (!hasUserLikedBefore) {
    toggledLike = await Like.create(likeObject);

    const likedComment = await Like.aggregate([
      {
        $match: {
          _id: toggledLike._id,
        },
      },
    ]);

    toggledLike = likedComment;
    message = "Reply liked successfully";
  } else {
    toggledLike = await Like.findOneAndDelete(likeObject);
    message = "Like removed from reply successfully";
  }

  return res.status(200).json(new ApiResponse(200, toggledLike, message));
});

const getLikedPosts = asyncHandler(async (req, res) => {
  const likedPosts = await Like.aggregate([
    {
      $match: {
        likedBy: req.user?._id,
        post: {
          $exists: true,
        },
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "post",
        foreignField: "_id",
        as: "post",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "postedBy",
              foreignField: "_id",
              as: "postedBy",
              pipeline: [
                {
                  $project: {
                    name: 1,
                    username: 1,
                    profilepic: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              postedBy: {
                $first: "$postedBy",
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        post: {
          $first: "$post",
        },
      },
    },
  ]);

  if (!likedPosts || likedPosts.length === 0) {
    throw new ApiError(404, "No Liked Posts");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        likedPosts,
        numOfLikedPosts: likedPosts.length,
      },
      "Liked posts fetched successfully"
    )
  );
});

export { togglePostLike, toggleCommentLike, toggleReplyLike, getLikedPosts };
