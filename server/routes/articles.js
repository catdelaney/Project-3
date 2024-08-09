
const express = require('express');
const Article = require('../models/Article');
const { expressjwt: jwtMiddleware } = require('express-jwt');

const router = express.Router();

// Get all articles (limited if not subscribed)
router.get('/', jwtMiddleware({ secret: process.env.JWT_SECRET, algorithms: ['HS256'], credentialsRequired: false }), async (req, res) => {
  try {
    const limit = req.auth && req.auth.isSubscribed ? 0 : 2;
    const articles = await Article.find().limit(limit).sort({ createdAt: -1 }).populate('comments');
    res.send(articles);
  } catch (error) {
    res.status(500).send({ error: 'Server error.' });
  }
});

// Get a single article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('comments');
    if (!article) return res.status(404).send({ error: 'Article not found.' });
    res.send(article);
  } catch (error) {
    res.status(500).send({ error: 'Server error.' });
  }
});

// Create a new article (authenticated users only)
router.post('/', jwtMiddleware({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), async (req, res) => {
  try {
    const { articleText, articleTitle } = req.body;
    const article = new Article({ articleText, articleTitle, username: req.auth.username });
    await article.save();
    res.status(201).send(article);
  } catch (error) {
    res.status(400).send({ error: 'Error creating article.' });
  }
});

// Update an article (authenticated users only)
router.put('/:id', jwtMiddleware({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), async (req, res) => {
  try {
    const { articleText, articleTitle } = req.body;
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).send({ error: 'Article not found.' });
    if (article.username !== req.auth.username) return res.status(403).send({ error: 'Not authorized.' });
    
    article.articleText = articleText || article.articleText;
    article.articleTitle = articleTitle || article.articleTitle;
    await article.save();
    
    res.send(article);
  } catch (error) {
    res.status(400).send({ error: 'Error updating article.' });
  }
});

// Delete an article (authenticated users only)
router.delete('/:id', jwtMiddleware({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).send({ error: 'Article not found.' });
    if (article.username !== req.auth.username) return res.status(403).send({ error: 'Not authorized.' });
    
    await article.remove();
    res.send({ message: 'Article deleted successfully.' });
  } catch (error) {
    res.status(500).send({ error: 'Server error.' });
  }
});

module.exports = router;
