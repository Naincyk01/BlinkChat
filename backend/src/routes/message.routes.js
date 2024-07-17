import express from 'express';
import { createMessage, getMessages, deleteMessage } from '../controllers/message.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js'; 

const router = express.Router();


router.post('/', verifyJWT, createMessage);


router.get('/:groupId', verifyJWT, getMessages);


router.delete('/:messageId', verifyJWT, deleteMessage);

export default router;
