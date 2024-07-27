import express from 'express';
import {
  findOneByUser,
  addParticipants,
  removeParticipant,
  createGroupConversation,
  deleteGroup,
  updateGroup,
  leaveGroup,
  createOneToOneConversation,
  getGroupConversations
} from '../controllers/group.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js'; 

const router = express.Router();


router.use(verifyJWT);


router.post('/one',  createOneToOneConversation);
router.post('/group',  createGroupConversation);

router.put('/:groupId', updateGroup);
router.put('/:groupId/participants', addParticipants);
router.delete('/:groupId/participants/:participantId', removeParticipant);
router.delete('/:groupId', deleteGroup);
router.delete('/:groupId/leave', leaveGroup);




router.get('/findone', findOneByUser );
router.get('/findgroup',getGroupConversations);

export default router;
