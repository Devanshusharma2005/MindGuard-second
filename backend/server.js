require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const userRoutes = require('./routes/user');
const healthTrackingRoutes = require('./routes/healthTracking');
const questionnaireRoutes = require('./routes/api/questionnaire');
const { router: voiceRoutes, setupWebSocket } = require('./routes/voice');
const doctorAuthRoutes = require('./routes/doctorAuth');
const adminAuthRoutes = require('./routes/adminAuth');
const gameLogRoutes = require('./routes/gameLog');
const memoriesRoutes = require('./routes/memories');
const chatRoutes = require('./routes/chat');
const debugRoutes = require('./routes/debug');
const { initializeWebSocket } = require('./services/websocketService');
const testApiRoutes = require('./routes/test-api');

const app = express();

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'mindguard-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Middleware with specific CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Allow your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/health-tracking', healthTrackingRoutes);
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/voice', voiceRoutes);
app.use('/api/auth/doctor', doctorAuthRoutes);
app.use('/api/auth/admin', adminAuthRoutes);
app.use('/api/game-logs', gameLogRoutes);
app.use('/api/memories', memoriesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/test', testApiRoutes);

// Debug endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// MongoDB Connection with error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB Connected');
  console.log('Database Name:', mongoose.connection.name);
})
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  console.error('Connection string:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
  process.exit(1);
});

// Add connection event listeners
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Import User model
const User = require('./models/User');

// Signup Route
app.post('/api/auth/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        msg: 'Please provide all required fields'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: 'User already exists'
      });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password // Note: In production, hash the password
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      msg: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      msg: 'Server error during signup',
      error: error.message
    });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid credentials'
      });
    }

    // Check password (simple check - in production use proper hashing)
    if (password !== user.password) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      msg: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      msg: 'Server error during login',
      error: error.message
    });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ msg: 'API is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    msg: 'Something went wrong!',
    error: err.message
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    msg: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Setup WebSocket server
setupWebSocket(server); 

// Initialize chat WebSocket service
initializeWebSocket(server);

// Handle server shutdown
process.on('SIGINT', () => {
  console.log('Server shutting down');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
}); 