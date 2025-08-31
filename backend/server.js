// server.js
const express = require('express')
const cors = require('cors')
const taskRoute = require('./src/routes/taskRoute')
const connectDB = require('./src/config/db')

require('dotenv').config()
// const app = require('./app') // This line is likely a duplicate or from a different pattern. Remove it.

const app = express(); // This is the correct initialization

// Connect to Database
connectDB();

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// API Routes
app.use('/api', taskRoute)

// Welcome Route
app.get('/', (req, res)=>{
    res.send('Welcome to the Task Manager API')
})

const PORT = process.env.PORT || 8000 // A different port like 8000 is common for backend servers

app.listen(PORT, ()=>{
    console.log(`The server is running on port: ${PORT}`)
})

module.exports = app;