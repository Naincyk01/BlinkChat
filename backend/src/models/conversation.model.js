import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['direct', 'group'],
      required: true,
    },
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    messages: [{
      type: Schema.Types.ObjectId,
      ref: 'Message',
    }],
  },
  { timestamps: true }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

export { Conversation };
