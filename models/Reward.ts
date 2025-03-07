import mongoose from 'mongoose';

const RewardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  earnedPoints: [{
    amount: Number,
    source: String,
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  badges: [{
    name: String,
    description: String,
    icon: String,
    dateEarned: Date
  }],
  redeemedRewards: [{
    name: String,
    description: String,
    icon: String,
    pointsCost: Number,
    dateRedeemed: Date
  }]
}, { timestamps: true });

export const Reward = mongoose.models.Reward || mongoose.model('Reward', RewardSchema); 