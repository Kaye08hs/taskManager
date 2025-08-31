// --- Imports ---
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const taskRoute = require('./src/routes/taskRoute');

// --- Configuration ---
// Load environment variables from .env file
dotenv.config();

// --- Initializations ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
// To parse JSON bodies from incoming requests
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    // Start the server only after a successful DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit the process if DB connection fails
  });

// --- Routes ---
// Base route for health check
app.get('/', (req, res) => {
  res.send('Task Manager API is running...');
});

// Use the task routes for any request to /api/tasks
app.use('/api/tasks', taskRoute);

// --- Error Handling Middleware (Optional but Recommended) ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
