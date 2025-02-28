import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Follow } from "../models/follow.models.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

const toggleFollow = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(404, "Invalid User Id");
  }

  const searhedUser = await User.findById(userId);
  if (!searhedUser) {
    throw new ApiError(404, "User does not exist");
  }

  const followObject = {
    follower: req?.user,
    following: searhedUser,
  };

  const isUserAlreadyFollowing = await Follow.findOne(followObject);

  let toggledFollow;
  let message;
  if (!isUserAlreadyFollowing) {
    toggledFollow = await Follow.create(followObject);
    message = "Followed successfully";
  } else {
    toggledFollow = await Follow.findOneAndDelete(followObject);
    message = "Unfollowed Successfully";
  }

  return res.status(200).json(new ApiResponse(200, toggledFollow, message));
});

const getFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(404, "Invalid User Id");
  }

  const searchedUser = await User.findById(userId);
  if (!searchedUser) {
    throw new ApiError(404, "User does not exist");
  }

  const followers = await Follow.aggregate([
    {
      $match: {
        following: searchedUser._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "follower",
        foreignField: "_id",
        as: "follower",
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
        follower: "$follower",
      },
    },
  ]);

  if (!followers) {
    throw new ApiError(404, "No followers");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, followers, "Followers fetched successfully"));
});

const getFollowings = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(404, "Invalid User Id");
  }

  const searchedUser = await User.findById(userId);
  if (!searchedUser) {
    throw new ApiError(404, "User does not exist");
  }

  const followings = await Follow.aggregate([
    {
      $match: {
        follower: searchedUser._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "following",
        foreignField: "_id",
        as: "following",
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
        following: {
          $first: "$following",
        },
      },
    },
  ]);

  if (!followings) {
    throw new ApiError(404, "No followings");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, followings, "Followings fetched successfully"));
});

export { toggleFollow, getFollowers, getFollowings };
