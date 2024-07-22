import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
  {
    name: {
      type: String,
    },
    type: {
      type: String,
      enum: ['one_to_one', 'group'],
      required: true,
    },
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

const Group = mongoose.model('Group', groupSchema);

export { Group };
