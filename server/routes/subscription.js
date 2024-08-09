const express = require('express');
const User = require('../models/User');
const { expressjwt: jwtMiddleware } = require('express-jwt');

const router = express.Router();

// Get subscription status
router.get('/status', jwtMiddleware({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), async (req, res) => {
  try {
    const user = await User.findById(req.auth.id);
    res.send({ isSubscribed: user.isSubscribed });
  } catch (error) {
    res.status(500).send({ error: 'Server error.' });
  }
});

module.exports = router;
