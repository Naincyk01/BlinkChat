import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createOneToOneConversation = asyncHandler(async (req, res) => {
    const { participant } = req.body;
    const admin = req.user._id;

    if (!participant) {
        throw new apiError(400, "Participant are required");
    }

    // Find the participant user
    const participantUser = await User.findOne({
        $or: [
            { username: participant },
            { fullName: participant }
        ]
    });

    if (!participantUser) {
        throw new apiError(400, "Participant does not exist");
    }

    const type = 'one_to_one';
    const participantIds = [participantUser._id];

    const conversation = await Group.create({
        type,
        participants: participantIds,
    });

    if (!conversation) {
        throw new apiError(500, "Failed to create conversation");
    }

    // Add the logged-in user as an additional participant
    conversation.participants.push(admin);
    await conversation.save();

    res.status(201).json(new apiResponse(201, conversation, "One-to-one conversation created successfully"));
});

const createGroupConversation = asyncHandler(async (req, res) => {
    const { name, participants } = req.body;
    const admin = req.user._id;

    if (!name || !participants || participants.length < 1) {
        throw new apiError(400, "Name and participants are required");
    }

    // Find all participant users
    const participantUsers = await User.find({
        $or: [
            { username: { $in: participants } },
            { fullName: { $in: participants } }
        ]
    });

    if (participantUsers.length !== participants.length) {
        throw new apiError(400, "One or more participants do not exist");
    }

    // Map participant IDs
    const participantIds = participantUsers.map(user => user._id);

  
    participantIds.push(admin);

    const type = 'group';

    const conversation = await Group.create({
        name,
        type,
        participants: participantIds,
        admin,
    });

    if (!conversation) {
        throw new apiError(500, "Failed to create conversation");
    }

    res.status(201).json(new apiResponse(201, conversation, "Group conversation created successfully"));
});


const addParticipants = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { participants } = req.body; // participants is expected to be an array even if single participant

    const userId = req.user._id; 

    const group = await Group.findById(groupId);
    
    if (!group) {
        throw new apiError(404, "Group not found");
    }

    // Check if the current user is the admin of the group
    if (group.admin.toString() !== userId.toString()) {
        throw new apiError(403, "You are not authorized to add participants to this group");
    }

    // Convert participants to an array if it's a single ID
    const participantsToAdd = Array.isArray(participants) ? participants : [participants];

    // Check if participants array contains valid user IDs
    const validParticipants = await User.find({ _id: { $in: participantsToAdd } });
    if (validParticipants.length !== participantsToAdd.length) {
        throw new apiError(400, "Invalid participants provided");
    }

    // Add new participants to the group
    group.participants.push(...participantsToAdd);
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
 
    const { groupId } = req.params;
    const userId = req.user._id; // Assuming req.user._id contains the current user's ID

    const conversation = await Group.findById(groupId);

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


const leaveGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user._id; 

    const group = await Group.findById(groupId);

    if (!group) {
        throw new apiError(404, "Group not found");
    }

    // Check if the user is the admin of the group (admins cannot leave their own group)
    if (group.admin.toString() === userId.toString()) {
        throw new apiError(403, "Admins cannot leave their own group");
    }

    // Remove the user from the participants array
    group.participants = group.participants.filter(id => id.toString() !== userId.toString());
    await group.save();

    return res.status(200).json(new apiResponse(200, group, "Left the group successfully"));
});

const updateGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { name } = req.body;
    const userId = req.user._id; 

    const group = await Group.findById(groupId);

    if (!group) {
        throw new apiError(404, "Group not found");
    }

    // Check if the current user is the admin of the conversation
    if (group.admin.toString() !== userId.toString()) {
        throw new apiError(403, "You are not authorized to update this conversation");
    }

    // Update group details
    group.name = name;
    await group.save();

    return res.status(200).json(new apiResponse(200, group, "Conversation updated successfully"));
});

const findOneByUser = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Assuming req.user._id contains the logged-in user's ID

    // Find Group document where the user is a participant
    const group = await Group.findOne({
        participants: userId
    })
    .populate({
        path: 'participants',
        select: 'fullName username lastSeen bio -_id', // Select desired fields, exclude _id
        match: { _id: { $ne: userId } } // Exclude the logged-in user
    })
    .catch(err => {
        throw new apiError(500, err.message || "Error retrieving Group data");
    });

    if (!group) {
        throw new apiError(404, "Group data not found for the user");
    }

    // Modify participants array to include desired fields
    const sanitizedParticipants = group.participants.map(participant => ({
        fullName: participant.fullName,
        username: participant.username,
        lastSeen: participant.lastSeen,
        bio: participant.bio
    }));

    // Construct the response object with sanitized participants
    const response = {
        _id: group._id,
        type: group.type,
        participants: sanitizedParticipants,
        latestMessage: group.latestMessage,
        messages: group.messages,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        __v: group.__v
    };

    // Respond with the modified Group document
    res.status(200).json(new apiResponse(200, response, "Group data retrieved successfully"));
});


const getGroupConversations = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Assuming req.user._id contains the logged-in user's ID

    // Find all group conversations where the user is either admin or participant
    const groupConversations = await Group.find({
        $or: [
            { admin: userId }, // User is admin
            { participants: userId } // User is participant
        ]
    })
    .catch(err => {
        throw new apiError(500, err.message || "Error retrieving group conversations");
    });

    // Respond with the retrieved group conversations
    res.status(200).json(new apiResponse(200, groupConversations, "Group conversations retrieved successfully"));
});

export {
    createOneToOneConversation,
    findOneByUser ,
    addParticipants,
    removeParticipant,
    deleteGroup,
    leaveGroup,
    updateGroup,
    createGroupConversation,
    getGroupConversations
};


