const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user profile - can fetch either by auth token or by userId parameter
router.get('/profile', auth, async (req, res) => {
  try {
    let userId = req.user.id;
    
    // If userId is provided in query params, use that instead
    // This allows admin routes or direct lookups
    if (req.query.userId) {
      userId = req.query.userId;
    }
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if the user has a name, if not, use username or email
    if (!user.name && user.username) {
      user.name = user.username;
    } else if (!user.name && user.email) {
      // Use the part before @ as a name if email exists
      user.name = user.email.split('@')[0];
    }
    
    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

module.exports = router; 