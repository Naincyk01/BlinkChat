import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const generateAccessAndRefereshTokens = async (userId) => {
    try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
  
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      throw new apiError(
        500,
        "Something went wrong while generating referesh and access token"
      );
    }
  };

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new apiError(401, "unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
        throw new apiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
        throw new apiError(401, "Refresh token is expired or used");
        }

        const options = {
        httpOnly: true,
        secure: true,
        };

        const { accessToken, newRefreshToken } =
        await generateAccessAndRefereshTokens(user._id);

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new apiResponse(
            200,
            { accessToken, refreshToken: newRefreshToken },
            "Access token refreshed"
            )
        );
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh token");
    }
});

const registerUser = asyncHandler(async(req,res)=>{

    const { fullName, email, username, password,bio } = req.body;

    if (
        [fullName, email, username, password,bio].some((field) => field?.trim === "")
    ) {
        throw new apiError(400, "All fields are required");
    }

    
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (existedUser) {
        throw new apiError(409, "User with email or username already exits");
    }

    
    const profileLocalPath = req.files?.profilepic[0]?.path;
    if (!profileLocalPath) {
    throw new apiError(400, "Profilepic file is required");
    }

    const profile = await uploadOnCloudinary(profileLocalPath);
    if(!profile){
    throw new apiError(400,"Error while uploading the profilepic")
    }

    const user = await User.create({
    fullName,
    profilepic: profile?.url || '',
    email,
    bio,
    password,
    username: username.toLowerCase(),
    });
    const createdUser = await User.findById(user._id).select(
    "-password -resfreshToken"
    );
    if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
    }
    return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User Registered Successfully"));

});


const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    
    if (!username && !email) {
      throw new apiError(400, "username or email is required");
    }
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (!user) {
      throw new apiError(400, "User does not exist");
    }
  
    const isPasswordValid = await user.isPasswordCorrect(password);
  
    if (!isPasswordValid) {
      throw new apiError(401, "Invalid user credentials");
    }
  
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );
  
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
  
    const options = {
      httpOnly: true,
      secure: true,
    };
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new apiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged In Successfully"
        )
      );
  });

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1, // this removes the field from document
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
      .json(new apiResponse(200, {}, "User logged Out"));
  });

const searchUsers = asyncHandler(async (req, res) => {
    const { searchTerm } = req.body;

  
    if (!searchTerm) {
      throw new apiError(400, "Search term parameter is required");
    }
  
    const currentUserID = req.user._id; // Assuming req.user._id contains the current user's ID
  
    let query = {};
  
    if (searchTerm.includes("@")) {
      query = {
        $and: [
          { _id: { $ne: currentUserID } }, // Exclude current user
          { email: searchTerm },
        ],
      };
    } else {
      query = {
        $and: [
          { _id: { $ne: currentUserID } }, // Exclude current user
          { $or: [
            { username: { $regex: searchTerm, $options: "i" } }, // Case-insensitive match on username
            { fullName: { $regex: searchTerm, $options: "i" } }, // Case-insensitive match on fullName
          ]}
        ],
      };
    }
  
    // Perform search based on the specified type
    const users = await User.find(query).select("-password -refreshToken"); // Exclude sensitive data
  
    if (users.length === 0) {
      return res.status(404).json({
        status: "success",
        message: "No users found matching the search term",
        data: [],
      });
    }
  
    return res.status(200).json({
      status: "success",
      data: users,
    });
  });
  

  

export { registerUser,
    loginUser,
    logoutUser,
    searchUsers,
    refreshAccessToken,
    generateAccessAndRefereshTokens,
 };
