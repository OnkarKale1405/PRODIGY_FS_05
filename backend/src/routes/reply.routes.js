import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  addReply,
  deleteReply,
  getReplies,
  updateReply,
} from "../controllers/reply.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/c/:commentId").get(getReplies).post(addReply);
router.route("/r/:replyId").patch(updateReply).delete(deleteReply);

export default router;
