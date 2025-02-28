import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.models.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const createPost = asyncHandler(async (req, res) => {
  const { caption } = req?.body;
  if (!caption || caption.trim() === "") {
    throw new ApiError(400, "Caption is empty");
  }

  const uploadedFiles = [];
  if (req.files && !(req.files.length === 0)) {
    for (const file of req.files) {
      if (file?.path) {
        const result = await uploadFileOnCloudinary(file.path);
        if (!result) {
          throw new ApiError(500, "Error while uploading media file");
        }
        uploadedFiles.push(result.url);
      }
    }
  }


  const post = await Post.create({
    mediaFile: uploadedFiles,
    caption,
    postedBy: req.user?._id,
  });

  if (!post) {
    throw new ApiError(500, "Error while posting");
  }

  const uploadedPost = await Post.findById(post._id);
  if (!uploadedPost) {
    throw new ApiError(500, "Post not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, uploadedPost, "Post uploaded successfully"));
});

const getAllPosts = asyncHandler(async (req, res) => {
  const getPosts = await Post.aggregate([
    {
      $match: {
        isPublic: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "postedBy",
        pipeline: [
          {
            $project: {
              username: 1,
              name: 1,
              profilepic: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likesOfPost",
        pipeline: [
          {
            $project: {
              likedBy: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "CommentsOfPost",
        pipeline: [
          {
            $project: {
              commentedBy: 1,
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
        numberOfLikes: {
          $sum: {
            $size: "$likesOfPost",
          },
        },
        hasUserLikedPost: {
          $cond: {
            if: {
              $in: [req?.user?._id, "$likesOfPost.likedBy"],
            },
            then: true,
            else: false,
          },
        },
        numberOfComments: {
          $sum: {
            $size: "$CommentsOfPost",
          },
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  if (!getPosts) {
    throw new ApiError(404, "No posts at the moment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getPosts, "Posts fetched successfully"));
});

const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId || postId.trim() === "") {
    throw new ApiError(400, "Post Id cannot be empty");
  }
  if (!mongoose.isValidObjectId(postId)) {
    throw new ApiError(404, "Post Id is not valid");
  }

  const post = await Post.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "postedBy",
        pipeline: [
          {
            $project: {
              username: 1,
              name: 1,
              profilepic: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likesOfPost",
        pipeline: [
          {
            $project: {
              likedBy: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "CommentsOfPost",
        pipeline: [
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
            $project: {
              content: 1,
              commentedBy: 1,
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
        numberOfLikes: {
          $sum: {
            $size: "$likesOfPost",
          },
        },
        hasUserLikedPost: {
          $cond: {
            if: {
              $in: [req?.user?._id, "$likesOfPost.likedBy"],
            },
            then: true,
            else: false,
          },
        },
        numberOfComments: {
          $sum: {
            $size: "$CommentsOfPost",
          },
        },
      },
    },
  ]);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post fetched successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { caption } = req.body;

  if (!postId || postId.trim() === "") {
    throw new ApiError(400, "Post Id cannot be empty");
  }
  if (!mongoose.isValidObjectId(postId)) {
    throw new ApiError(404, "Post Id is not valid");
  }
  console.log(caption);
  if (!caption || caption.trim() === "") {
    throw new ApiError(400, "New Caption should be present");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post does not exist");
  }
  if (req.user?._id?.toString() !== post.postedBy.toString()) {
    throw new ApiError(403, "Unauthorized request");
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        caption: caption,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedPost) {
    throw new ApiError(500, "Error while updating post");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId || postId.trim() === "") {
    throw new ApiError(400, "Post Id cannot be empty");
  }
  if (!mongoose.isValidObjectId(postId)) {
    throw new ApiError(404, "Post Id is not valid");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post does not exist");
  }
  if (req.user?._id?.toString() !== post.postedBy.toString()) {
    throw new ApiError(403, "Unauthorized request");
  }

  if (post.mediaFile && post.mediaFile.length > 0) {
    for (const media of post.mediaFile) {
      const mediaFilePublicId = media?.split("/").pop().split(".")[0];
      console.log("Deleting post with Id : ", mediaFilePublicId);
      const deleteMedia = await cloudinary.uploader.destroy(mediaFilePublicId, {
        resource_type: "auto",
        invalidate: true,
      });
      if (!deleteMedia) {
        throw new ApiError(500, "Error while deleting post");
      }
    }
  }

  const deletePostObject = await Post.findByIdAndDelete(postId);
  if (!deletePostObject) {
    throw new ApiError(500, "Error while deleting the post");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletePostObject, "Post deleted successfully"));
});

const togglePublicStatus = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId || postId.trim() === "") {
    throw new ApiError(400, "Post Id cannot be empty");
  }
  if (!mongoose.isValidObjectId(postId)) {
    throw new ApiError(404, "Post Id is not valid");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post does not exist");
  }
  if (req.user?._id?.toString() !== post.postedBy.toString()) {
    throw new ApiError(403, "Unauthorized request");
  }

  const updatePublicStatus = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        isPublic: !post.isPublic,
      },
    },
    {
      new: true,
    }
  );

  if (!updatePublicStatus) {
    throw new ApiError(500, "Error while changing public status");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatePublicStatus,
        "Post Public Status Changed Successfully"
      )
    );
});

export {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  togglePublicStatus,
};
