import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createGroup = asyncHandler(async (req, res) => {
    const { name, type, participants } = req.body;
    const admin = req.user._id; 

    if (!name || !type || !participants) {
        throw new apiError(400, "All fields (name, type, participants) are required");
    }

    // Validate if all participants exist
    const existingParticipants = await User.find({ _id: { $in: participants } });
    if (existingParticipants.length !== participants.length) {
        throw new apiError(400, "One or more participants do not exist");
    }


    const conversation = await Group.create({
        name,
        type,
        participants,
        admin,
    });

    if (!conversation) {
        throw new apiError(500, "Failed to create conversation");
    }

  
    res.status(201).json(new apiResponse(201, conversation, "Conversation created successfully"));
});


const getConversations = asyncHandler(async (req, res) => {
    const userId = req.user._id; 
    const conversations = await Group.find({ participants: userId })
        .populate('participants', 'fullName profilepic') 
        .populate('latestMessage', 'content createdAt'); 

    return res.status(200).json(new apiResponse(200, conversations, "Conversations fetched successfully"));
});


const addParticipants = asyncHandler(async (req, res) => {
    
});


const removeParticipant = asyncHandler(async (req, res) => {
  
});


const deleteGroup = asyncHandler(async (req, res) => {
 
});

export {
    createGroup,
    getConversations,
    addParticipants,
    removeParticipant,
    deleteGroup,
};


