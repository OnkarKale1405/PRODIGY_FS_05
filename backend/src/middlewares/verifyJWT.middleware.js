import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const verifyJWT = async (req, res, next) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] || req.cookies?.accessToken;
  if (!token) {
    return res.sendStatus(401);
  }
  console.log(token);
  const response = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const theUser = await User.findById(response._id).select(
    "-password -refreshToken"
  );
  req.user = theUser;
  next();
};
export { verifyJWT };
