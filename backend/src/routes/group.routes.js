import express from 'express';
import {
  createGroup,
  getConversations,
  addParticipants,
  removeParticipant,
  deleteGroup,
} from '../controllers/group.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js'; 

const router = express.Router();


router.use(verifyJWT);


router.post('/', createGroup);


router.get('/', getConversations);

router.put('/:groupId/participants', addParticipants);

router.delete('/:groupId/participantId', removeParticipant);

router.delete('/:groupId', deleteGroup);

export default router;
