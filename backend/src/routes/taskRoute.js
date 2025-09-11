const express = require('express')
const router = express.Router()
const taskController = require('../controllers/taskController')

// Create a task
router.post('/v1/task', taskController.createTask)

// Get all tasks (with filtering and searching)
router.get('/v1/task', taskController.getAllTask)

// Get a single task by its ID
router.get('/v1/task/:task_id', taskController.getTaskById)

// Update a task by its ID (can be used for title, description, and status)
router.patch('/v1/task/:task_id', taskController.updateTaskById)

// Delete a task by its ID
router.delete('/v1/task/:task_id', taskController.deleteTaskById)

// router.put('/v1/task/:task_id', taskController.markTaskAsComplete)

module.exports = router