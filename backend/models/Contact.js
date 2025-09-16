const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    unique: true,
    match: [
      /^\+[1-9]\d{1,14}$/,
      'Please provide a valid phone number in E.164 format',
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// To prevent Mongoose from throwing an OverwriteModelError in a serverless environment
// where the model might be compiled multiple times, we check if the model already exists.
module.exports = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);