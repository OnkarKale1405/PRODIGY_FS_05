import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  getLikedPosts,
  toggleCommentLike,
  togglePostLike,
  toggleReplyLike,
} from "../controllers/like.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/p/:postId").post(togglePostLike);
router.route("/c/:commentId").post(toggleCommentLike);
router.route("/r/:replyId").post(toggleReplyLike);
router.route("/posts").get(getLikedPosts);

export default router;
