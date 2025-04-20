const mongoose = require('mongoose');

const ExtraDetailsPatientSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  appointmentRequestDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  medicalHistory: {
    type: String
  },
  currentMedications: [{
    type: String
  }],
  allergies: [{
    type: String
  }],
  symptoms: {
    type: String
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('extraDetailsPatient', ExtraDetailsPatientSchema); 