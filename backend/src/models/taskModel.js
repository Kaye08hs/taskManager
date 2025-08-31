const mongoose = require('mongoose');

// Define the schema for the Task model
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'], // Custom error message
    trim: true, // Removes whitespace from both ends
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  completed: {
    type: Boolean,
    default: false // A new task is not completed by default
  },
  createdAt: {
    type: Date,
    default: Date.now // Sets the creation date automatically
  }
});

// Create the model from the schema and export it
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
