import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  changePassword,
  getRandomUsers,
  getSelf,
  getUserProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccount,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(upload.single("profilepic"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/update-account").patch(verifyJWT, upload.single("profilepic"), updateAccount);
router.route("/change-pass").post(verifyJWT, changePassword);
router.route("/profile/:username").get(verifyJWT, getUserProfile);
router.route("/refresh-token").post(verifyJWT, refreshAccessToken);
router.route("/me").get(verifyJWT, getSelf);
router.route("/random-users").get(verifyJWT, getRandomUsers);

export default router;
