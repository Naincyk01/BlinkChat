import express from 'express';
import { createMessage, getMessages, deleteMessage, updateMessage, markMessageAsRead, getUnreadMessagesCount } from '../controllers/message.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js'; 

const router = express.Router();

router.use(verifyJWT);

router.post('/',createMessage);


router.get('/:groupId', getMessages);


router.delete('/:messageId', deleteMessage);


router.put('/:messageId', updateMessage);


router.put('/mark-read/:messageId', markMessageAsRead);


router.get('/unread-count', getUnreadMessagesCount);

export default router;
