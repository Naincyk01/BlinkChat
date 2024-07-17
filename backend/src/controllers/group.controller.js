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
    const { groupId } = req.params;
    const { participants } = req.body;
    const userId = req.user._id; 

    const group = await Group.findById(groupId);
    
    if (!group) {
        throw new apiError(404, "Group not found");
    }

    // Check if the current user is the admin of the conversation
    if (group.admin.toString() !== userId.toString()) {
        throw new apiError(403, "You are not authorized to add participants to this conversation");
    }

    // Check if participants array contains valid user IDs
    const validParticipants = await User.find({ _id: { $in: participants } });
    if (validParticipants.length !== participants.length) {
        throw new apiError(400, "Invalid participants provided");
    }

    // Add new participants to the conversation
    group.participants.push(...participants);
    await group.save();

    return res.status(200).json(new apiResponse(200, group, "Participants added successfully"));
    
});


const removeParticipant = asyncHandler(async (req, res) => {
  
    const { groupId, participantId } = req.params;
    const userId = req.user._id; 

    const group = await Group.findById(groupId);

    if (!group) {
        throw new apiError(404, "group not found");
    }

    // Check if the current user is the admin of the conversation
    if (group.admin.toString() !== userId.toString()) {
        throw new apiError(403, "You are not authorized to remove participants from this conversation");
    }

    // Remove the participant from the conversation
    group.participants = group.participants.filter(id => id.toString() !== participantId);
    await group.save();

    return res.status(200).json(new apiResponse(200, group, "Participant removed successfully"));

});


const deleteGroup = asyncHandler(async (req, res) => {
 
    const { conversationId } = req.params;
    const userId = req.user._id; // Assuming req.user._id contains the current user's ID

    const conversation = await Group.findById(conversationId);

    if (!conversation) {
        throw new apiError(404, "Conversation not found");
    }

    // Check if the current user is the admin of the conversation
    if (conversation.admin.toString() !== userId.toString()) {
        throw new apiError(403, "You are not authorized to delete this conversation");
    }

    await Group.findByIdAndDelete(groupId);

    return res.status(200).json(new apiResponse(200, {}, "Conversation deleted successfully"));

});

export {
    createGroup,
    getConversations,
    addParticipants,
    removeParticipant,
    deleteGroup,
};


