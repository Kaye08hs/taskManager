const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Define the routes for the Task resource

// GET /api/tasks - Get all tasks
// POST /api/tasks - Create a new task
router.route('/')
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

// GET /api/tasks/:id - Get a single task by ID
// PUT /api/tasks/:id - Update a task by ID
// DELETE /api/tasks/:id - Delete a task by ID
router.route('/:id')
  .get(taskController.getTaskById)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
