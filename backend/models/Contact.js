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

// Mongoose automatically looks for the plural, lowercased version of your model name.
// Thus, the 'Contact' model is for the 'contacts' collection.
module.exports = mongoose.model('Contact', ContactSchema);
