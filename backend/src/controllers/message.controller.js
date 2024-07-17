import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Message } from "../models/message.model.js";
import { Group } from "../models/group.model";
import { apiResponse } from "../utils/apiResponse.js";

const createMessage = asyncHandler(async (req, res) => {
    const { groupId, content, type } = req.body;
    const senderId = req.user._id; 
    
    const group = await Group.findById(groupId);
   
    // Check if group exists and if sender is a participant
    if (!group || !group.participants.includes(senderId)) {
        throw new apiError(404, "Group not found or user is not a participant");
    }

    const message = await Message.create({
        groupId,
        sender:senderId,
        content,
        type,
    });

    // Add the created message's ID to the group's messages array
    group.messages.push(message._id);
    await group.save();
    
    group.latestMessage = message._id;
    await group.save();

    return res.status(201).json(new apiResponse(201, message, "Message sent successfully"));


});

const getMessages = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user._id; // Assuming req.user._id contains the current user's ID

    const group = await Group.findById(groupId);
    
    if (!group) {
        throw new apiError(404, "Group not found");
    }

    // Check if the user is a participant in the group
    if (!group.participants.includes(userId)) {
        throw new apiError(403, "You are not authorized to view messages in this group");
    }

    const messages = await Message.find({ groupId }).populate('sender', 'username fullName');

    return res.status(200).json(new apiResponse(200, messages, "Messages retrieved successfully"));

});


const deleteMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user._id;

  
    const message = await Message.findById(messageId);
    if (!message) {
        throw new apiError(404, "Message not found");
    }

  
    const group = await Group.findById(message.groupId);
    if (!group && !group.admin.equals(userId) && !message.sender.equals(userId)) {
        throw new apiError(403, "You are not authorized to delete this message");
    }


    await message.remove();

    return res.status(200).json(new apiResponse(200, {}, "Message deleted successfully"));
});


export {
    createMessage,
    getMessages,
    deleteMessage
};

