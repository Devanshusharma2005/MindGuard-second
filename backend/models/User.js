const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const bookingSchema = new mongoose.Schema({
  doctor: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['virtual', 'in-person'],
    required: true,
  },
  status: {
    type: String,
    default: 'scheduled',
  },
  avatar: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bookings: [bookingSchema]
});

// Add pre-save hook to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password along with the new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);