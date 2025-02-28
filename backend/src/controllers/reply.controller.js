import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Reply } from "../models/reply.models.js";
import { Comment } from "../models/comment.models.js";
import mongoose from "mongoose";

const addReply = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content of Reply cannot be empty");
  }
  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(404, "Invalid comment Id");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment does not exist");
  }

  const reply = await Reply.create({
    comment: comment,
    repliedBy: req?.user,
    content: content,
  });
  if (!reply) {
    throw new ApiError(500, "Error occurred when replying");
  }

  const createdReply = await Reply.findById(reply?._id);
  if (!createdReply) {
    throw new ApiError(500, "Error creating reply");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdReply, "Replied successfully"));
});

const getReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(404, "Invalid Comment Id");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const replies = await Reply.aggregate([
    {
      $match: {
        comment: new mongoose.Types.ObjectId(commentId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "repliedBy",
        foreignField: "_id",
        as: "repliedBy",
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
        repliedBy: {
          $first: "$repliedBy",
        },
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "reply",
        as: "likesOfReply",
        pipeline: [
          {
            $project: {
              reply: 1,
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
            $size: "$likesOfReply",
          },
        },
        hasUserLikedReply: {
          $cond: {
            if: {
              $in: [req.user?._id, "$likesOfReply.likedBy"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);

  if (!replies || replies.length === 0) {
    throw new ApiError(404, "No replies found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, replies, "Replies of comment fetched successfully")
    );
});

const updateReply = asyncHandler(async (req, res) => {
  const { replyId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content of reply cannot be empty");
  }
  if (!mongoose.isValidObjectId(replyId)) {
    throw new ApiError(404, "Invalid Reply Id");
  }

  const reply = await Reply.findById(replyId);
  if (!reply) {
    throw new ApiError(404, "Reply does not exist");
  }
  if (req?.user._id?.toString() !== reply.repliedBy.toString()) {
    throw new ApiError(403, "Unauthorized request");
  }

  const updatedReply = await Reply.findByIdAndUpdate(
    reply._id,
    {
      $set: {
        content: content,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedReply) {
    throw new ApiError(500, "Error while updating reply");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedReply, "Reply updated successfully"));
});

const deleteReply = asyncHandler(async (req, res) => {
  const { replyId } = req.params;

  if (!mongoose.isValidObjectId(replyId)) {
    throw new ApiError(404, "Invalid Reply Id");
  }

  const reply = await Reply.findById(replyId);
  if (!reply) {
    throw new ApiError(404, "Reply does not exist");
  }
  if (req?.user._id?.toString() !== reply.repliedBy.toString()) {
    throw new ApiError(403, "Unauthorized request");
  }

  const deletedreply = await Reply.findByIdAndDelete(reply._id);

  if (!deletedreply) {
    throw new ApiError(500, "Error while deleting reply");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedreply, "Reply deleted successfully"));
});

export { addReply, getReplies, updateReply, deleteReply };
