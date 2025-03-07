const mongoose = require('mongoose');

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

module.exports = mongoose.model('User', userSchema);