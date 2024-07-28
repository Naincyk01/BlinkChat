import express from 'express';
import {
  createOneToOneConversation,
  findOneByUser,
  createGroupConversation,
  getGroupConversations,
  deleteGroup,
  addParticipants,
  removeParticipant,
  updateGroup,
  leaveGroup,
  getParticipantsDetails 
} from '../controllers/group.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js'; 

const router = express.Router();


router.use(verifyJWT);


router.post('/one',  createOneToOneConversation);
router.post('/group',  createGroupConversation);
router.delete('/:groupId', deleteGroup);
router.get('/:groupId/participants', getParticipantsDetails);
router.get('/findone', findOneByUser );
router.get('/findgroup',getGroupConversations);

router.put('/:groupId', updateGroup);
router.put('/:groupId/participants', addParticipants);
router.delete('/:groupId/participants/:participantId', removeParticipant);
router.delete('/:groupId/leave', leaveGroup);





export default router;
