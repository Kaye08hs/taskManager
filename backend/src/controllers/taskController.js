const Task = require('../models/taskModel')
const validateRequest = require('../utils/RequestValidation')

exports.createTask = async (req, res)=> {
    try{
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        const task = new Task({
            title,
            description
            // 'status' will be 'pending' by default from the model
        })

        const new_task = await task.save();

        res.status(201).json({ // 201 Created is more appropriate
            message: "Successfully created new task",
            data: new_task
        })

    }catch(error){
        console.log(error)
        res.status(500).json({ // 500 for server errors
            message: error.message
        })
    }
}

// GET All Tasks (with Search and Filter)
exports.getAllTask = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = {};

        // 1. Filter by status
        if (status) {
            // Validate status value
            const allowedStatuses = ['pending', 'in-progress', 'completed'];
            if (allowedStatuses.includes(status)) {
                query.status = status;
            } else {
                return res.status(400).json({ message: `Invalid status value. Allowed values are: ${allowedStatuses.join(', ')}` });
            }
        }

        // 2. Search by keyword (in title and description)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } }, // 'i' for case-insensitive
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json({
            count: tasks.length,
            data: tasks
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
}


// GET Task by ID
exports.getTaskById = async (req, res) => {
    try{
        const task = await Task.findById(req.params.task_id)

        if(!task) {
            return res.status(404).json({ // Add return to stop execution
                message: "Task not found"
            })
        }

        res.status(200).json({
            data: task
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

// UPDATE Task by ID
exports.updateTaskById = async (req, res) => {
    try{
        const updatedData = req.body

        // Optional: Prevent users from updating certain fields directly if needed
        // For example: delete updatedData.createdAt;

        const updated_task = await Task.findByIdAndUpdate(
            req.params.task_id,
            updatedData,
            {
                new: true, // Return the modified document
                runValidators: true // Run schema validators on update
            }
        )

        if(!updated_task){
            return res.status(404).json({
                message: "Task not found and unable to update it"
            })
        }

        res.status(200).json({
            message: "Updated the task successfully",
            data: updated_task
        })  

    }catch(error){
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}


// DELETE Task by ID
exports.deleteTaskById = async (req, res) => {
    try{
        const deleted_task = await Task.findByIdAndDelete(req.params.task_id)
        if(!deleted_task) {
            return res.status(404).json({
                message: "Task not found and unable to delete it"
            })
        }
        res.status(200).json({
            message: "Task has been deleted successfully",
            data: deleted_task
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}