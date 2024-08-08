// Imports
const { Schema, model } = require("mongoose");
const commentSchema = require("./Comment");

// Article schema
const articleSchema = new Schema(
  {
    articleText: {
      type: String,
      required: true,
      maxlength: 280,
      minlength: 1,
    },
    articleTitle: {
        type: String,
        required: true,
        maxlength: 150,
        minlength: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    articleAuthor: {
      type: String,
      required: true,
    },
    comments: [commentSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Increases comment count in Article model object when comments are added to an article
articleSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// Creates Article model with articleSchema
const Article = model("Article", articleSchema);

// Exports
module.exports = Article;