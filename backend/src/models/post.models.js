import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    mediaFile: [
      {
        type: String,
      },
    ],
    caption: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model("Post", postSchema);
