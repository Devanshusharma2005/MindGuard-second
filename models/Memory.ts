import mongoose from 'mongoose';

const MemorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Index for faster queries by userId and date
MemorySchema.index({ userId: 1, date: 1 });

export const Memory = mongoose.models.Memory || mongoose.model('Memory', MemorySchema); 