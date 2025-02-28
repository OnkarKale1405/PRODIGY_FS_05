import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Comment } from "../models/comment.models.js";
import { Post } from "../models/post.models.js";
import mongoose from "mongoose";

const createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is empty");
  }
  if (!mongoose.isValidObjectId(postId)) {
    throw new ApiError(404, "Post Id is not valid");
  }
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const comment = await Comment.create({
    post: post,
    commentedBy: req?.user,
    content: content,
  });
  if (!comment) {
    throw new ApiError(500, "Error while commenting");
  }

  const createdComment = await Comment.findById(comment?._id);
  if (!createdComment) {
    throw new ApiError(500, "Comment not created");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdComment, "Comment created successfully"));
});

const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.isValidObjectId(postId)) {
    throw new ApiError(404, "Invalid Post Id");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const comments = await Comment.aggregate([
    {
      $match: {
        post: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "commentedBy",
        foreignField: "_id",
        as: "commentedBy",
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
        commentedBy: {
          $first: "$commentedBy",
        },
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "likesOfComment",
        pipeline: [
          {
            $project: {
              comment: 1,
              likedBy: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        numberOfLikes: {
          $sum: {
            $size: "$likesOfComment",
          },
        },
        hasUserLikedComment: {
          $cond: {
            if: {
              $in: [req.user?._id, "$likesOfComment.likedBy"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $lookup: {
        from: "replies",
        localField: "_id",
        foreignField: "comment",
        as: "replies",
        pipeline: [
          {
            $project: {
              content: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        numberOfReplies: {
          $sum: {
            $size: "$replies",
          },
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Post comments fetched successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content cannot be empty");
  }
  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(404, "Invalid comment Id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment does not exist");
  }
  if (req.user?._id?.toString() !== comment.commentedBy.toString()) {
    throw new ApiError(401, "Unauthorized request");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    comment._id,
    {
      $set: {
        content: content,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedComment) {
    throw new ApiError(500, "Error while updating comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(404, "Invalid comment Id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment does not exist");
  }
  if (req.user?._id?.toString() !== comment.commentedBy.toString()) {
    throw new ApiError(401, "Unauthorized request");
  }

  const deletedComment = await Comment.findByIdAndDelete(comment._id);

  if (!deletedComment) {
    throw new ApiError(500, "Error while deleting comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedComment, "Comment deleted successfully"));
});

export { createComment, getComments, updateComment, deleteComment };
