const mongoose = require('mongoose')

const db = async ()=>{
    try {
       await mongoose.connect(process.env.MONGO_URI)
        console.log('CONNECTED TO THE DATABASE')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}


const express = require('express')
const cors = require('cors')

const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))

db();

const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>{
    console.log(`THE SERVER IS RUNNING ON PORT: ${PORT}`)
})

module.exports = app;


const mongoose = require('mongoose')
const { type } = require('os')
const { stat } = require('fs')

const task = mongoose.Schema({
    title:{
        type: String,
        required: ['plis intir taytil']
    },
    description:{
        type: String
    },
    status:{
        type: Boolean,
        default: 'pinding'
    }
})

