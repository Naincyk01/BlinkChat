import { Group } from '../models/group.model.js';
import { User } from '../models/user.model.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Message } from '../models/message.model.js';

const createOneToOneConversation = asyncHandler(async (req, res) => {
  const { participant } = req.body;
  const admin = req.user._id;

  if (!participant) {
    throw new apiError(400, 'Participant are required');
  }

  // Find the participant user
  const participantUser = await User.findOne({
    $or: [{ username: participant }, { fullName: participant }],
  });

  if (!participantUser) {
    throw new apiError(400, 'Participant does not exist');
  }

  const type = 'one_to_one';
  const participantIds = [participantUser._id, admin];

  const conversation = await Group.create({
    type,
    participants: participantIds,
  });

  if (!conversation) {
    throw new apiError(500, 'Failed to create conversation');
  }

  res
    .status(201)
    .json(new apiResponse(201, conversation, 'One-to-one conversation created successfully'));
});
const createGroupConversation = asyncHandler(async (req, res) => {
  const { name, participants } = req.body;
  const admin = req.user._id;

  if (!name || !participants || participants.length < 1) {
    throw new apiError(400, 'Name and participants are required');
  }

  // Find all participant users
  const participantUsers = await User.find({
    $or: [{ username: { $in: participants } }, { fullName: { $in: participants } }],
  });

  if (participantUsers.length !== participants.length) {
    throw new apiError(400, 'One or more participants do not exist');
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
    throw new apiError(500, 'Failed to create conversation');
  }

  res
    .status(201)
    .json(new apiResponse(201, conversation, 'Group conversation created successfully'));
});
const deleteGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  const conversation = await Group.findById(groupId);

  if (!conversation) {
    throw new apiError(404, 'Conversation not found');
  }

  if (conversation.type === 'one_to_one' || conversation.type === 'group') {
    if (conversation.messages && conversation.messages.length > 0) {
      const messageIds = conversation.messages.map(msg => msg._id);

      for (const messageId of messageIds) {
        await Message.findByIdAndDelete(messageId);
      }
    }
    if (conversation.type === 'group' && conversation.admin.toString() !== userId.toString()) {
      throw new apiError(403, 'You are not authorized to delete this conversation');
    }
    await Group.findByIdAndDelete(groupId);
  } else {
    throw new apiError(400, 'Invalid conversation type');
  }

  return res
    .status(200)
    .json(new apiResponse(200, {}, 'Conversation and associated messages deleted successfully'));
});
const getGroupConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const groupConversations = await Group.find({
    $or: [{ admin: userId }, { participants: userId }],
    $expr: {
      $gt: [{ $size: '$participants' }, 2],
    },
  });

  res
    .status(200)
    .json(new apiResponse(200, groupConversations, 'Group conversations retrieved successfully'));
});
const findOneByUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const groups = await Group.aggregate([
    {
      $match: {
        participants: userId,
      },
    },
    {
      $addFields: {
        participantCount: { $size: '$participants' },
      },
    },
    {
      $match: {
        participantCount: 2,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants',
      },
    },
    {
      $unwind: '$participants',
    },
    {
      $match: {
        'participants._id': { $ne: userId },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            '$participants',
            {
              _id: '$_id',
              type: '$type',
              latestMessage: '$latestMessage',
              messages: '$messages',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt',
              __v: '$__v',
            },
          ],
        },
      },
    },
    {
      $project: {
        _id: 1,
        type: 1,
        fullName: '$fullName',
        username: '$username',
        bio: '$bio',
        profilepic: '$profilepic',
        latestMessage: 1,
        messages: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,
      },
    },
  ]);

  res.status(200).json({
    statusCode: 200,
    data: groups,
    message: 'Group data retrieved successfully',
    success: true,
  });
});
const getParticipantsDetails = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  // Step 1: Find the group by ID
  const group = await Group.findById(groupId);

  if (!group) {
    throw new apiError(404, 'Group not found');
  }

  // Step 2: Extract participant IDs
  const participantIds = group.participants;

  // Step 3: Fetch participant details
  const participants = await User.find({
    _id: { $in: participantIds },
  }).select('_id username fullName');

  if (!participants || participants.length === 0) {
    throw new apiError(404, 'Participants not found');
  }

  // Return the participant details along with IDs
  res.status(200).json(new apiResponse(200, participants, 'Participants retrieved successfully'));
});
const addParticipants = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { participants } = req.body; // participants is expected to be an array even if single participant

  const userId = req.user._id;

  const group = await Group.findById(groupId);

  if (!group) {
    throw new apiError(404, 'Group not found');
  }

  // Check if the current user is the admin of the group
  if (group.admin.toString() !== userId.toString()) {
    throw new apiError(403, 'You are not authorized to add participants to this group');
  }

  // Convert participants to an array if it's a single ID
  const participantsToAdd = Array.isArray(participants) ? participants : [participants];

  // Check if participants array contains valid user IDs
  const validParticipants = await User.find({ _id: { $in: participantsToAdd } });
  if (validParticipants.length !== participantsToAdd.length) {
    throw new apiError(400, 'Invalid participants provided');
  }

  // Add new participants to the group
  group.participants.push(...participantsToAdd);
  await group.save();

  return res.status(200).json(new apiResponse(200, group, 'Participants added successfully'));
});
const getGroupDetailsById = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findById(groupId);

  if (!group) {
    throw new apiError(404, 'Group not found');
  }
  res.status(200).json(new apiResponse(200, group, 'Group details retrieved successfully'));
});
const removeParticipant = asyncHandler(async (req, res) => {
  const { groupId, participantId } = req.params;
  const userId = req.user._id;

  const group = await Group.findById(groupId);

  if (!group) {
    throw new apiError(404, 'group not found');
  }

  // Check if the current user is the admin of the conversation
  if (group.admin.toString() !== userId.toString()) {
    throw new apiError(403, 'You are not authorized to remove participants from this conversation');
  }

  // Remove the participant from the conversation
  group.participants = group.participants.filter(id => id.toString() !== participantId);
  await group.save();

  return res.status(200).json(new apiResponse(200, group, 'Participant removed successfully'));
});
const updateGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { name } = req.body;
  const userId = req.user._id;

  const group = await Group.findById(groupId);

  if (!group) {
    throw new apiError(404, 'Group not found');
  }

  // Check if the current user is the admin of the conversation
  if (group.admin.toString() !== userId.toString()) {
    throw new apiError(403, 'You are not authorized to update this conversation');
  }

  // Update group details
  group.name = name;
  await group.save();

  return res.status(200).json(new apiResponse(200, group, 'Conversation updated successfully'));
});

const leaveGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  const group = await Group.findById(groupId);

  if (!group) {
    throw new apiError(404, 'Group not found');
  }

  // Check if the user is the admin of the group (admins cannot leave their own group)
  if (group.admin.toString() === userId.toString()) {
    throw new apiError(403, 'Admins cannot leave their own group');
  }

  // Remove the user from the participants array
  group.participants = group.participants.filter(id => id.toString() !== userId.toString());
  await group.save();

  return res.status(200).json(new apiResponse(200, group, 'Left the group successfully'));
});

export {
  createOneToOneConversation,
  findOneByUser,
  createGroupConversation,
  getGroupConversations,
  deleteGroup,
  getParticipantsDetails,
  addParticipants,
  removeParticipant,
  leaveGroup,
  updateGroup,
  getGroupDetailsById,
};
