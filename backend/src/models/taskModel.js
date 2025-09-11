const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    title:{
        type:String,
        required: [true, 'Please provide a title for the task'],
        trim:true
    },
    description:{
        type:String,
        required: [true, 'Please provide a description for the task'],
        trim:true
    },
    status :{ // Renamed from task_status for clarity
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    }
}, {timestamps:true}) /**this will automatically adds createdAt and updatedAt */

module.exports = mongoose.model('Task', TaskSchema)



