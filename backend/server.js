const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const Contact = require('./models/Contact');

const app = express();

// --- Middleware ---
app.use(cors()); // Allow requests from the frontend
app.use(express.json()); // Parse JSON bodies

// --- File Upload Setup (Multer) ---
// We'll store files in memory for this simulation.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI;

// Vercel handles one-time connection, no need for complex logic here for now
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected successfully.'))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      // In a serverless environment, we log the error but don't exit the process
    });
} else {
  console.warn('MONGO_URI not found. Database features will not be available.');
}

// --- API Routes ---
const transformContact = (contact) => {
  const { _id, __v, ...rest } = contact.toObject ? contact.toObject() : contact;
  return { id: _id.toString(), ...rest };
};

// GET all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ name: 1 });
    res.json(contacts.map(transformContact));
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ message: 'Server Error: Could not fetch contacts.' });
  }
});

// POST a new contact
app.post('/api/contacts', async (req, res) => {
  try {
    const newContact = new Contact({
      name: req.body.name,
      phone: req.body.phone,
    });
    const savedContact = await newContact.save();
    res.status(201).json(transformContact(savedContact));
  } catch (err) {
    if (err.code === 11000) { // Handle duplicate phone number
      return res.status(409).json({ message: 'Phone number already exists.' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Error creating contact:', err);
    res.status(500).json({ message: 'Server Error: Could not create contact.' });
  }
});

// DELETE a contact by ID
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid contact ID format.' });
    }
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).json({ message: 'Server Error: Could not delete contact.' });
  }
});

// --- Webhook Verification Endpoint ---
// This endpoint is used by Meta to verify the webhook URL.
app.get('/api/webhook', (req, res) => {
  // Your verification token. Should be a random string and stored as an environment variable.
  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || "merajWebhookToken";

  // Parse the query params from the request
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Webhook verification request received:', req.query);

  // Checks if a token and mode are in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      console.log('WEBHOOK_VERIFICATION_FAILED');
      res.sendStatus(403);
    }
  } else {
     // Responds with '400 Bad Request' if mode or token is missing
    res.status(400).json({ message: 'Missing required query parameters for webhook verification.' });
  }
});


// POST to send a bulk message (mock endpoint)
app.post('/api/send-bulk', upload.single('media'), (req, res) => {
  const { heading, content, contacts: contactsJSON } = req.body;
  const mediaFile = req.file;

  if (!content) {
    return res.status(400).json({ message: 'Message content cannot be empty.' });
  }

  let contacts;
  try {
    contacts = JSON.parse(contactsJSON);
    if (!Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ message: 'No contacts provided or invalid format.' });
    }
  } catch (error) {
    return res.status(400).json({ message: 'Invalid contacts format.' });
  }
  
  console.log('\n--- SIMULATING BULK MESSAGE SEND ---');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Heading: ${heading}`);
  console.log(`Content: ${content}`);
  console.log(`Media File: ${mediaFile ? `${mediaFile.originalname} (${mediaFile.mimetype})` : 'None'}`);
  console.log(`Sending to ${contacts.length} contacts:`);
  contacts.forEach(contact => {
    console.log(`  - ${contact.name} (${contact.phone})`);
  });
  console.log('-------------------------------------\n');

  // Simulate network delay
  setTimeout(() => {
    res.status(200).json({ message: `Message successfully sent to ${contacts.length} contacts.` });
  }, 1500);
});


// --- Start Server (for local development) ---
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running for local development on http://localhost:${PORT}`));
}

// --- Export app for Vercel ---
module.exports = app;
