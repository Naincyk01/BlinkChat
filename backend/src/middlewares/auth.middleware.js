import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

console.log("hello");
export const verifyJWT = asyncHandler(async (req, _, next) => {
  console.log("hello");
  try {
    console.log("hello2");
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    //  console.log(token);
    if (!token) {
      throw new apiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new apiError(401, "Invalid Access Token");
    }

    req.user = user;
    console.log("byee")
    next();
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid access token");
  }
});
