const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const GameLog = require('../models/GameLog');

// Get all game logs for a user
router.get('/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Ensure the requesting user matches the user ID in params or is an admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access to game logs' });
    }
    
    const logs = await GameLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(100); // Limit to last 100 entries
      
    res.json(logs);
  } catch (err) {
    console.error('Error fetching game logs:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get game logs for a specific game type
router.get('/:userId/type/:gameType', auth, async (req, res) => {
  try {
    const { userId, gameType } = req.params;
    
    // Ensure the requesting user matches the user ID in params or is an admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access to game logs' });
    }
    
    const logs = await GameLog.find({ userId, gameType })
      .sort({ createdAt: -1 })
      .limit(50);
      
    res.json(logs);
  } catch (err) {
    console.error('Error fetching game logs by type:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Create a new game log
router.post('/', auth, async (req, res) => {
  try {
    const { 
      gameType, 
      duration, 
      completionStatus, 
      score, 
      notes, 
      metadata 
    } = req.body;
    
    // Create and save the game log
    const newLog = new GameLog({
      userId: req.user.id,
      gameType,
      duration,
      completionStatus,
      score,
      notes,
      metadata
    });
    
    await newLog.save();
    
    res.status(201).json(newLog);
  } catch (err) {
    console.error('Error creating game log:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get game statistics for a user
router.get('/:userId/stats', auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Ensure the requesting user matches the user ID in params or is an admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access to game stats' });
    }
    
    // Get total time spent on each game type
    const gameTimes = await GameLog.aggregate([
      { $match: { userId } },
      { $group: {
          _id: '$gameType',
          totalTime: { $sum: '$duration' },
          count: { $sum: 1 },
          avgScore: { $avg: '$score' }
        }
      }
    ]);
    
    // Get highest scores
    const highestScores = await GameLog.aggregate([
      { $match: { userId } },
      { $group: {
          _id: '$gameType',
          highestScore: { $max: '$score' }
        }
      }
    ]);
    
    // Get session count by day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyActivity = await GameLog.aggregate([
      { 
        $match: { 
          userId,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      gameTimes,
      highestScores,
      dailyActivity
    });
  } catch (err) {
    console.error('Error fetching game statistics:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router; 