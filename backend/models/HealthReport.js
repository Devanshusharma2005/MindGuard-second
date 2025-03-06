const mongoose = require('mongoose');

const healthReportSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  questionnaireData: {
    mood: Number,
    anxiety: String,
    sleep_quality: Number,
    energy_levels: Number,
    physical_symptoms: String,
    concentration: Number,
    self_care: String,
    social_interactions: Number,
    intrusive_thoughts: String,
    optimism: Number,
    stress_factors: String,
    coping_strategies: String,
    social_support: Number,
    self_harm: String,
    discuss_professional: String
  },
  emotionReport: {
    summary: {
      emotions_count: Map,
      average_confidence: Number,
      average_valence: Number,
      crisis_count: Number,
      risk_factors: [String]
    },
    disorder_indicators: [String]
  },
  progressData: {
    moodData: [{
      date: Date,
      mood: Number,
      anxiety: Number,
      stress: Number
    }],
    sleepData: [{
      date: Date,
      hours: Number,
      quality: Number
    }],
    activityData: [{
      date: Date,
      exercise: Number,
      meditation: Number,
      social: Number
    }]
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HealthReport', healthReportSchema); 