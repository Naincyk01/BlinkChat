// import { asyncHandler } from "../utils/asyncHandler.js";
// import { apiError } from "../utils/apiError.js";
// import { User } from "../models/user.model.js";
// import { apiResponse } from "../utils/apiResponse.js";
// import jwt from "jsonwebtoken";
// import mongoose from "mongoose";

// const registerUser = asyncHandler(async(req,res)=>{

//     const { fullName, email, username, password,bio } = req.body;

//     if (
//         [fullName, email, username, password].some((field) => field?.trim === "")
//       ) {
//         throw new apiError(400, "All fields are required");
//       }

    
//       const existedUser = await User.findOne({
//         $or: [{ username }, { email }],
//       });
//       if (existedUser) {
//         throw new apiError(409, "User with email or username already exits");
//       }
 
      
//   const profileLocalPath = req.files?.profilepic[0]?.path;



// })