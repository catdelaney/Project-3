const express = require('express');
const Thought = require('../models/Thought');
const { expressjwt: jwtMiddleware } = require('express-jwt');

const router = express.Router();

// Get all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find().populate('author');
    res.send(thoughts);
  } catch (error) {
    res.status(500).send({ error: 'Server error.' });
  }
});

// Create a new thought
router.post('/', jwtMiddleware({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), async (req, res) => {
  try {
    const { content } = req.body;
    const thought = new Thought({ content, author: req.auth.id });
    await thought.save();
    res.status(201).send(thought);
  } catch (error) {
    res.status(400).send({ error: 'Error creating thought.' });
  }
});

// Delete a thought (author only)
router.delete('/:id', jwtMiddleware({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) return res.status(404).send({ error: 'Thought not found.' });
    if (thought.author.toString() !== req.auth.id) return res.status(403).send({ error: 'Not authorized.' });
    
    await thought.remove();
    res.send({ message: 'Thought deleted successfully.' });
  } catch (error) {
    res.status(500).send({ error: 'Server error.' });
  }
});

module.exports = router;
