import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, name, password } = req.body;

  if (
    !email ||
    email.trim() === "" ||
    !username ||
    username.trim() === "" ||
    !name ||
    name.trim() === "" ||
    !password ||
    password.trim() === ""
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const doesUserAlreadyExist = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (doesUserAlreadyExist) {
    throw new ApiError(
      409,
      "User with provided email or username already exists"
    );
  }

  // console.log(req.file);
  // const profilePicLocalPath = await req.file?.path;
  // if (!profilePicLocalPath) {
  //   throw new ApiError(400, "Profile photo is required");
  // }

  // let profilepic = await uploadFileOnCloudinary(profilePicLocalPath);
  // if (!profilepic) {
  //   throw new ApiError(400, "Profile picture is required");
  // }

  const user = await User.create({
    email,
    username: username.toLowerCase(),
    name,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registration Successful"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or Email is required");
  }

  const foundUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!foundUser) {
    throw new ApiError(404, "User does not exist");
  }

  const match = await bcrypt.compare(password, foundUser.password);
  let loggedInUser;
  let accessToken;
  let refreshToken;
  if (match) {
    //create JWT object
    accessToken = jwt.sign(
      {
        username: foundUser.username,
        email: foundUser.email,
        _id: foundUser._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_EXPIRY,
      }
    );
    refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_EXPIRY,
      }
    );
    //saving refreshtoken with current user
    foundUser.refreshToken = refreshToken;
    await foundUser.save({ validateBeforeSave: false });

    loggedInUser = await User.findById(foundUser._id).select(
      "-password -refreshToken"
    );
  } else {
    throw new ApiError(401, "Invalid Credentials");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Login Successful"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logout Successful"));
});

const updateAccount = asyncHandler(async (req, res) => {
  const { name, email, bio } = req.body;

  let profilepic;
  const profilepicLocalPath = req.file?.path;

  if (
    !(
      name ||
      email ||
      bio ||
      profilepicLocalPath ||
      profilepicLocalPath.trim() === ""
    )
  ) {
    throw new ApiError(400, "At least one field is required");
  }

  if (profilepicLocalPath && profilepicLocalPath.trim() !== "") {
    profilepic = await uploadFileOnCloudinary(profilepicLocalPath);
    if (!profilepic.url) {
      throw new ApiError(400, "Error while uploading profile photo");
    }
    const oldprofilepic = req.user?.profilepic?.split("/").pop().split(".")[0];
    if (oldprofilepic) {
      const deletedprofilepic = await cloudinary.uploader.destroy(
        oldprofilepic,
        {
          resource_type: "image",
          invalidate: true,
        }
      );
      console.log("Old profile photo deleted? ", deletedprofilepic);
    }
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        name: name || req.user.name,
        email: email || req.user.email,
        bio: bio || req.user.bio,
        profilepic: profilepic?.url || req.user.profilepic,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "Error updating details");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!(oldPassword && newPassword && confirmPassword)) {
    throw new ApiError(400, "All password fields are required");
  }

  if (!(newPassword === confirmPassword)) {
    throw new ApiError(400, "New Password and Confirm Password do not match");
  }

  const user = await User.findById(req.user?._id);

  const isPassCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isPassCorrect) {
    throw new ApiError(400, "Invalid Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username || username.trim() === "") {
    throw new ApiError(400, "Username is missing");
  }

  const profile = await User.aggregate([
    {
      $match: {
        username: username,
      },
    },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "following",
        as: "followers",
      },
    },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "follower",
        as: "followings",
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "postedBy",
        as: "posts",
      },
    },
    {
      $addFields: {
        followersCount: {
          $size: "$followers",
        },
        followingsCount: {
          $size: "$followings",
        },
        posts: "$posts",
        postsCount: {
          $size: "$posts",
        },
        isFollowing: {
          $cond: {
            if: { $in: [req.user?._id, "$followers.follower"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        name: 1,
        username: 1,
        bio: 1,
        isFollowing: 1,
        followersCount: 1,
        followingsCount: 1,
        profilepic: 1,
        posts: 1,
        postsCount: 1,
      },
    },
  ]);

  console.log(profile);

  if (!profile) {
    throw new ApiError(404, "User does not exists");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "User profile fethed successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.user.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findOne({ username: decodedToken.username });
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    const accessToken = jwt.sign(
      {
        username: user.username,
        email: user.email,
        _id: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_EXPIRY,
      }
    );
    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_EXPIRY,
      }
    );
    //saving refreshtoken with current user
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access Token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const getSelf = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const getRandomUsers = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $match: {
        username: { $ne: req.user.username },
      },
    },
    {
      $lookup: {
        from: "follows",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$follower", req.user._id] },
                  { $eq: ["$following", "$$userId"] },
                ],
              },
            },
          },
        ],
        as: "followedUsers",
      },
    },
    {
      $match: {
        followedUsers: { $size: 0 },
      },
    },
    { $sample: { size: 4 } },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        users,
        "Random users not followed fetched successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  updateAccount,
  changePassword,
  getUserProfile,
  refreshAccessToken,
  getSelf,
  getRandomUsers,
};
