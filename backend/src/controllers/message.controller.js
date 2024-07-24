import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { Message } from '../models/message.model.js';
import { Group } from '../models/group.model.js';
import { User } from '../models/user.model.js';
import { apiResponse } from '../utils/apiResponse.js';
import {uploadOnCloudinary} from "../utils/cloudinary.js"

// const cleanDeletedMessagesByGroupId = async (groupId) => {
//     try {
//         // Find the group by groupId
//         const group = await Group.findById(groupId);

//         if (!group) {
//             throw new apiError(404, 'Group not found');
//         }

//         // Iterate over the messages array of the group
//         let updatedMessages = [];
//         for (let messageId of group.messages) {
//             // Check if the message exists
//             const message = await Message.findById(messageId);
//             if (message) {
//                 updatedMessages.push(messageId); // Add message ID if it exists
//             }
//         }

//         // Update the group's messages array with existing message IDs
//         group.messages = updatedMessages;

//         // Update latestMessage if necessary
//         if (group.messages.length > 0) {
//             const latestMessage = await Message.findOne({ _id: { $in: group.messages } }).sort({ createdAt: -1 });
//             group.latestMessage = latestMessage ? latestMessage._id : null;
//         } else {
//             group.latestMessage = null; // No messages left, set latestMessage to null
//         }

//         // Save the updated group
//         await group.save();
//     } catch (error) {
//         // Handle errors if any
//         console.error('Error cleaning deleted messages from group:', error);
//         throw new apiError(500, 'Failed to clean deleted messages from group');
//     }
// };


  
const createMessage = asyncHandler(async (req, res) => {
  const { groupId, content, type } = req.body;
  const senderId = req.user._id;

  if (!groupId || !content) {
      throw new apiError(400, "Group ID and content are required");
  }

  const group = await Group.findById(groupId);

  // Check if group exists
  if (!group) {
      throw new apiError(404, 'Group not found');
  }

  // Check if sender is a participant or admin of the group
  if (!group.participants.includes(senderId) && group.admin.toString() !== senderId.toString()) {
      throw new apiError(403, 'You are not authorized to send messages in this group');
  }

  let fileUrl = '';
  if (type && ['file', 'image', 'video', 'pdf'].includes(type)) {
      const fileLocalPath = req.files?.file[0]?.path;
      if (!fileLocalPath) {
          throw new apiError(400, 'File upload is required for this message type');
      }
      const fileupload = await uploadOnCloudinary(fileLocalPath);

      if (!fileupload) {
          throw new apiError(400, "Error while uploading the file");
      }
      fileUrl = fileupload.url;
  }

  // Fetch sender details (fullName)
  const sender = await User.findById(senderId, 'fullName username');

  const message = await Message.create({
      groupId,
      sender: senderId, // Store sender's ID in the message
      content,
      type: type || 'text', // Use 'text' as default if type is not provided
      file: fileUrl || '', // URL or path to the file (if messageType is 'file', 'image', etc.)
  });

  // Update group with the latest message and add message ID to messages array
  group.latestMessage = message._id;
  group.messages.push(message._id);
  await group.save();

//   await cleanDeletedMessagesByGroupId(groupId);
  // Prepare response data including sender details
  const responseData = {
      _id: message._id,
      groupId: message.groupId,
      sender: {
          _id: senderId,
          fullName: sender.fullName, 
          username: sender.username,
      },
      content: message.content,
      type: message.type,
      file: message.file,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
  };

  return res.status(201).json(new apiResponse(201, responseData, 'Message sent successfully'));
});

const getMessages = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user._id; // Assuming req.user._id contains the current user's ID

  const group = await Group.findById(groupId);

  if (!group) {
    throw new apiError(404, 'Group not found');
  }

  // Check if the user is a participant in the group
  if (!group.participants.includes(userId) && group.admin.toString() !== userId.toString()) {
    throw new apiError(403, 'You are not authorized to view messages in this group');
  }
  // Implement pagination for messages retrieval
  const messages = await Message.find({ groupId })
    .populate('sender', 'username fullName')
    .sort({ createdAt: 1 }) // Sort by most recent first
    .limit(50); // Example: Limit to 50 messages per request

  return res.status(200).json(new apiResponse(200, messages, 'Messages retrieved successfully'));
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  const message = await Message.findById(messageId);

  if (!message) {
      throw new apiError(404, "Message not found");
  }

  // Check if the user is the sender of the message or admin of the group
  const group = await Group.findById(message.groupId);
  if (!group) {
      throw new apiError(404, "Group not found");
  }

  if (!message.sender.equals(userId) && !group.admin.equals(userId)) {
      throw new apiError(403, "You are not authorized to delete this message");
  }

  // Delete the message using findByIdAndDelete
  await Message.findByIdAndDelete(messageId);

  // Optionally update the group's latestMessage and messages array
  const index = group.messages.indexOf(message._id);
  if (index !== -1) {
      group.messages.splice(index, 1);
      if (group.latestMessage.equals(message._id)) {
          group.latestMessage = group.messages.length > 0 ? group.messages[group.messages.length - 1] : null;
      }
      await group.save();
  }

  return res.status(200).json(new apiResponse(200, {}, "Message deleted successfully"));
});



const updateMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const { content, type } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
        throw new apiError(404, "Message not found");
    }

    // Check if the user is the sender of the message
    if (!message.sender.equals(userId)) {
        throw new apiError(403, "You are not authorized to update this message");
    }

    // Update message content and type
    message.content = content;
    message.type = type;
    await message.save();

    return res.status(200).json(new apiResponse(200, message, "Message updated successfully"));
});

const markMessageAsRead = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
        throw new apiError(404, "Message not found");
    }

    // Mark message as read only if the current user is the recipient
    if (!message.recipient.equals(userId)) {
        throw new apiError(403, "You are not authorized to mark this message as read");
    }

    message.isRead = true;
    await message.save();

    return res.status(200).json(new apiResponse(200, message, "Message marked as read"));
});

const getUnreadMessagesCount = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Count unread messages where the user is the recipient
    const unreadCount = await Message.countDocuments({ recipient: userId, isRead: false });

    return res.status(200).json(new apiResponse(200, { unreadCount }, "Unread messages count retrieved"));
});


export { createMessage, getMessages, deleteMessage,updateMessage,markMessageAsRead,getUnreadMessagesCount };
