import express from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import {
  createMessage,
  getMessages,
  deleteMessage,
  updateMessage,
  markMessageAsRead,
  getUnreadMessagesCount,
  getMessageByMessageId,
} from '../controllers/message.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyJWT);

router.route('/').post(
  upload.fields([
    {
      name: 'file',
      maxCount: 1,
    },
  ]),
  createMessage,
);

router.get('/:groupId', getMessages);
router.get('/message/:messageId', getMessageByMessageId);

router.delete('/:messageId', deleteMessage);
router.put('/:messageId', updateMessage);
router.put('/mark-read/:messageId', markMessageAsRead);
router.get('/unread-count', getUnreadMessagesCount);

export default router;
