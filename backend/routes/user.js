const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user profile - can fetch either by auth token or by userId parameter
router.get('/profile', auth, async (req, res) => {
  try {
    let userId;
    
    // If userId is provided in query params, use that instead
    // This allows admin routes or direct lookups
    if (req.query.userId) {
      userId = req.query.userId;
    } else if (req.user && req.user.id) {
      // Otherwise use the authenticated user's ID
      userId = req.user.id;
    } else {
      return res.status(401).json({ error: 'User ID not found' });
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

// Get user registrations for analytics dashboard
router.get('/registrations', auth, async (req, res) => {
  try {
    // Check if user has admin permissions
    if (!req.user.isAdmin && !req.user.isDoctor) {
      return res.status(403).json({ error: 'Unauthorized access to user registrations' });
    }
    
    // Parse date range from query parameters
    const { startDate, endDate } = req.query;
    
    // Create date filters
    const dateFilter = {};
    if (startDate) {
      dateFilter.createdAt = { $gte: new Date(startDate) };
    }
    if (endDate) {
      dateFilter.createdAt = { ...dateFilter.createdAt, $lte: new Date(endDate) };
    }
    
    // Query for user registrations within the date range
    const users = await User.find(dateFilter)
      .select('_id createdAt name email username')
      .sort({ createdAt: 1 });
    
    // Format the response
    const registrations = users.map(user => ({
      userId: user._id,
      registrationDate: user.createdAt,
      name: user.name || user.username || user.email.split('@')[0]
    }));
    
    // Get therapist registrations for the same period (if needed)
    const therapistRegistrations = await User.find({
      ...dateFilter,
      isDoctor: true
    }).countDocuments();
    
    res.json({
      registrations,
      therapists: therapistRegistrations,
      count: registrations.length
    });
  } catch (err) {
    console.error('Error fetching user registrations:', err);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

module.exports = router;