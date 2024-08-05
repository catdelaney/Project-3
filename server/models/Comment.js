// Imports
const { Schema, Types } = require("mongoose");

// This will not be a model, but rather will be used as the comment field's sub-document schema in the Article model
const commentSchema = new Schema({
  commentId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  commentBody: {
    type: String,
    required: true,
    maxlength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Exports
module.exports = commentSchema;