const express = require('express');
const User = require('../models/User');
const { expressjwt: jwtMiddleware } = require('express-jwt');

const router = express.Router();

// Get user profile
router.get('/:id', jwtMiddleware({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).send({ error: 'User not found.' });
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: 'Server error.' });
  }
});

// Update user profile
router.put('/:id', jwtMiddleware({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ error: 'User not found.' });
    if (user._id.toString() !== req.auth.id) return res.status(403).send({ error: 'Not authorized.' });
    
    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();
    
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: 'Error updating user.' });
  }
});

module.exports = router;
