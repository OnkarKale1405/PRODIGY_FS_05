import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  getFollowers,
  getFollowings,
  toggleFollow,
} from "../controllers/follow.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/toggle/:userId").post(toggleFollow);
router.route("/followers/:userId").get(getFollowers);
router.route("/followings/:userId").get(getFollowings);

export default router;
