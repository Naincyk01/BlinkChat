const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
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
      enum: ['text', 'image', 'file'], 
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    attachments: [{
      filename: String,
      url: String,
      type: String,
    }],
    editedAt: {
      type: Date,
      default: null,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    mentions: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    reactions: [{
      emoji: String,
      users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
      }],
    }],
  },
  { timestamps: true }
);
