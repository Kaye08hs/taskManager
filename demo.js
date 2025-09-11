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