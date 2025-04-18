const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Debug endpoint to check MongoDB collections and models
router.get('/models', async (req, res) => {
  try {
    // Get all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Get all registered models in Mongoose
    const modelNames = Object.keys(mongoose.models);
    
    // Check Chat-related models
    const chatModelsExist = {
      conversation: collectionNames.includes('conversations'),
      message: collectionNames.includes('messages'),
      chatMessage: collectionNames.includes('chatmessages')
    };
    
    // Count documents in chat collections
    let counts = {};
    
    if (chatModelsExist.conversation) {
      counts.conversations = await mongoose.connection.db.collection('conversations').countDocuments();
    }
    
    if (chatModelsExist.message) {
      counts.messages = await mongoose.connection.db.collection('messages').countDocuments();
    }
    
    if (chatModelsExist.chatMessage) {
      counts.chatMessages = await mongoose.connection.db.collection('chatmessages').countDocuments();
    }
    
    // Check user-related models
    const userModelsExist = {
      user: collectionNames.includes('users'),
      doctor: collectionNames.includes('doctors'),
      admin: collectionNames.includes('admins')
    };
    
    // Count documents in user collections
    if (userModelsExist.user) {
      counts.users = await mongoose.connection.db.collection('users').countDocuments();
    }
    
    if (userModelsExist.doctor) {
      counts.doctors = await mongoose.connection.db.collection('doctors').countDocuments();
    }
    
    if (userModelsExist.admin) {
      counts.admins = await mongoose.connection.db.collection('admins').countDocuments();
    }
    
    res.json({
      success: true,
      database: mongoose.connection.name,
      registeredModels: modelNames,
      collections: collectionNames,
      chatModelsExist,
      userModelsExist,
      counts
    });
  } catch (error) {
    console.error('Debug model check error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Test conversation creation endpoint
router.post('/create-test-conversation', async (req, res) => {
  try {
    const { userId, targetId, targetType } = req.body;
    
    if (!userId || !targetId || !targetType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: userId, targetId, targetType' 
      });
    }
    
    // Verify both users exist
    let userModel, targetModel;
    
    // Determine user model based on current implementation
    if (mongoose.models.User) {
      userModel = mongoose.models.User;
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'User model not found' 
      });
    }
    
    // Determine target model based on target type
    if (targetType === 'doctor' && mongoose.models.Doctor) {
      targetModel = mongoose.models.Doctor;
    } else if (targetType === 'admin' && mongoose.models.Admin) {
      targetModel = mongoose.models.Admin;
    } else if (targetType === 'patient' && mongoose.models.User) {
      targetModel = mongoose.models.User;
    } else {
      return res.status(400).json({ 
        success: false, 
        error: `${targetType} model not found` 
      });
    }
    
    // Verify user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    // Verify target exists
    const target = await targetModel.findById(targetId);
    if (!target) {
      return res.status(404).json({ 
        success: false, 
        error: `${targetType} not found` 
      });
    }
    
    // Create a conversation
    const { Conversation } = require('../models/Chat');
    
    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      'participants.user': { $all: [userId, targetId] },
      isActive: true
    });
    
    if (existingConversation) {
      return res.json({
        success: true,
        message: 'Conversation already exists',
        conversation: existingConversation
      });
    }
    
    // Create new conversation
    const conversation = new Conversation({
      participants: [
        { user: userId, role: 'patient' },
        { user: targetId, role: targetType }
      ],
      participantModel: user.role === 'patient' ? 'User' : (user.role === 'doctor' ? 'Doctor' : 'Admin'),
      title: 'Test Conversation',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    });
    
    await conversation.save();
    
    res.json({
      success: true,
      message: 'Test conversation created',
      conversation
    });
    
  } catch (error) {
    console.error('Debug conversation creation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get list of available doctors for testing
router.get('/doctors', async (req, res) => {
  try {
    // Find Doctor model
    let doctorModel;
    if (mongoose.models.Doctor) {
      doctorModel = mongoose.models.Doctor;
    } else {
      return res.status(404).json({ 
        success: false, 
        error: 'Doctor model not found' 
      });
    }
    
    // Get a limited list of doctors
    const doctors = await doctorModel.find({})
      .select('_id fullName email specialization')
      .limit(10);
    
    if (!doctors || doctors.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'No doctors found'
      });
    }
    
    res.json({
      success: true,
      count: doctors.length,
      doctors
    });
    
  } catch (error) {
    console.error('Debug getting doctors error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get list of patients (users) for testing
router.get('/patients', async (req, res) => {
  try {
    // Find User model
    let userModel;
    if (mongoose.models.User) {
      userModel = mongoose.models.User;
    } else {
      return res.status(404).json({ 
        success: false, 
        error: 'User model not found' 
      });
    }
    
    // Get a limited list of patients
    const patients = await userModel.find({})
      .select('_id username email name')
      .limit(10);
    
    if (!patients || patients.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'No patients found'
      });
    }
    
    res.json({
      success: true,
      count: patients.length,
      patients
    });
    
  } catch (error) {
    console.error('Debug getting patients error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get list of admins for testing
router.get('/admins', async (req, res) => {
  try {
    // Find Admin model
    let adminModel;
    if (mongoose.models.Admin) {
      adminModel = mongoose.models.Admin;
    } else {
      return res.status(404).json({ 
        success: false, 
        error: 'Admin model not found' 
      });
    }
    
    // Get a limited list of admins
    const admins = await adminModel.find({})
      .select('_id fullName email role')
      .limit(10);
    
    if (!admins || admins.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'No admins found'
      });
    }
    
    res.json({
      success: true,
      count: admins.length,
      admins
    });
    
  } catch (error) {
    console.error('Debug getting admins error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get analytics data from collections
router.get('/analytics', async (req, res) => {
  try {
    // Check for timeframe parameter
    const { timeframe } = req.query;
    let dateFilter = {};
    
    // Apply date filtering based on timeframe
    if (timeframe) {
      const now = new Date();
      
      switch (timeframe) {
        case '1w': // 1 week
          dateFilter = { startTime: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
          break;
        case '2w': // 2 weeks
          dateFilter = { startTime: { $gte: new Date(now.setDate(now.getDate() - 14)) } };
          break;
        case '4w': // 4 weeks / 1 month
          dateFilter = { startTime: { $gte: new Date(now.setDate(now.getDate() - 28)) } };
          break;
        case '3m': // 3 months
          dateFilter = { startTime: { $gte: new Date(now.setMonth(now.getMonth() - 3)) } };
          break;
        case '6m': // 6 months
          dateFilter = { startTime: { $gte: new Date(now.setMonth(now.getMonth() - 6)) } };
          break;
        case '1y': // 1 year
          dateFilter = { startTime: { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) } };
          break;
      }
    }

    // Get total counts with date filter
    const stats = {
      totalInteractions: await mongoose.connection.db.collection('userinteractions').countDocuments(dateFilter),
      totalChats: await mongoose.connection.db.collection('chatmessages').countDocuments(dateFilter),
      totalUsers: await mongoose.connection.db.collection('users').countDocuments(),
      flaggedInteractions: await mongoose.connection.db.collection('userinteractions').countDocuments({ 
        ...dateFilter,
        'metadata.isFlagged': true 
      })
    };

    // Get sentiment distribution with date filter
    const sentimentStats = await mongoose.connection.db.collection('userinteractions').aggregate([
      {
        $match: {
          ...dateFilter,
          'metadata.sentiment': { $exists: true }
        }
      },
      {
        $group: {
          _id: '$metadata.sentiment',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Get topic distribution with date filter
    const topicStats = await mongoose.connection.db.collection('userinteractions').aggregate([
      {
        $match: {
          ...dateFilter,
          'metadata.topic': { $exists: true }
        }
      },
      {
        $group: {
          _id: '$metadata.topic',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]).toArray();

    // Get interactions by date for time series with date filter
    const dailyStats = await mongoose.connection.db.collection('userinteractions').aggregate([
      {
        $match: dateFilter
      },
      {
        $group: {
          _id: {
            year: { $year: '$startTime' },
            month: { $month: '$startTime' },
            day: { $dayOfMonth: '$startTime' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]).toArray();

    // Get recent interactions with more detailed information
    const recentInteractions = await mongoose.connection.db.collection('userinteractions').aggregate([
      {
        $match: dateFilter
      },
      {
        $sort: { startTime: -1 }
      },
      {
        $limit: 10 // Increased from 5 to 10 recent interactions
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $addFields: {
          userName: {
            $cond: {
              if: { $gt: [{ $size: '$userDetails' }, 0] },
              then: { 
                $concat: [
                  { $ifNull: [{ $arrayElemAt: ['$userDetails.username', 0] }, ''] },
                  ' ',
                  { $ifNull: [{ $arrayElemAt: ['$userDetails.name', 0] }, ''] }
                ]
              },
              else: 'Anonymous User'
            }
          }
        }
      },
      {
        $project: {
          userId: 1,
          userName: 1,
          interactionType: 1,
          startTime: 1,
          endTime: 1,
          chatHistory: { $slice: ['$chatHistory', -1] }, // Get the last message
          questionnaireResponses: 1,
          metadata: 1,
          duration: {
            $cond: {
              if: { $and: ['$startTime', '$endTime'] },
              then: { $subtract: ['$endTime', '$startTime'] },
              else: null
            }
          }
        }
      }
    ]).toArray();

    // Format response
    res.json({
      overview: stats,
      sentiment: sentimentStats,
      topics: topicStats,
      dailyStats: dailyStats,
      recentInteractions: recentInteractions
    });

  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;