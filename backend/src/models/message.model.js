import mongoose, { Schema } from "mongoose";
const messageSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'video', 'image', 'file', 'pdf'],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    file: {
      type: String  // URL or path to the file (if messageType is 'file', 'image', etc.)
    }
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

export { Message };