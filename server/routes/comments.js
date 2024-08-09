
const express = require('express');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const { expressjwt: jwtMiddleware } = require('express-jwt');

const router = express.Router();

// Add a comment to an article
router.post('/', jwtMiddleware({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), async (req, res) => {
  try {
    const { commentBody, articleId } = req.body;
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).send({ error: 'Article not found.' });
    
    const comment = {
      commentBody,
      username: req.auth.username,
    };
    
    article.comments.push(comment);
    await article.save();
    
    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send({ error: 'Error adding comment.' });
  }
});

// Get comments for an article
router.get('/article/:articleId', async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId).populate('comments');
    if (!article) return res.status(404).send({ error: 'Article not found.' });
    res.send(article.comments);
  } catch (error) {
    res.status(500).send({ error: 'Server error.' });
  }
});

// Delete a comment from an article (authenticated users only)
router.delete('/:articleId/:commentId', jwtMiddleware({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), async (req, res) => {
  try {
    const { articleId, commentId } = req.params;
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).send({ error: 'Article not found.' });
    
    const comment = article.comments.id(commentId);
    if (!comment) return res.status(404).send({ error: 'Comment not found.' });
    if (comment.username !== req.auth.username) return res.status(403).send({ error: 'Not authorized.' });
    
    comment.remove();
    await article.save();
    
    res.send({ message: 'Comment deleted successfully.' });
  } catch (error) {
    res.status(500).send({ error: 'Server error.' });
  }
});

module.exports = router;
