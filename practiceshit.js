
const mongoose = require('mongoose')

// const koneksaditabis = async () =>{
//     try{
//         await mongoose.connect(process.env.MONGODB_LINK)
//         console.log('KONEKTID NAKA SA DITABIS')
//     }
//     catch(error){
//         console.log(error)
//         process.exit(1)
//     }
// }


const connecttoDB = async () =>{
    try{
        await mongoose.connection(process.env.MONGODB_URI)
        console.log('CONNECTED TO DB')
    }
    catch(error){
        console.log(error)
        process.exit(1)
    }
}




const sampleSchema = new mongoose.Schema({
    practice:{
        type: String,
        required: [true, 'required ni']
    },
    time:{
        type:timeStamp,
        required: [true, 'required ni']
    },
})

module.exports = mongoose.model('Sample', sampleSchema)




const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    name:{
        type: String,
        required: [true, 'please enter value']
    },

    age:{
        type: int
    },

    gender:{
        type:String
    }

})


exports.createAtask = async () =>{
    try{

        const { title, description } = req.body
        
        if(!title || !description) {
            return res.status(400).json({ message: "REQUIRED"})
        }

        const task = new Task({
            title,
            description
        })

        const new_task = await task.save();
    }
    catch{

    }
}




exports.createTask = async(req, res) =>{
    try{
        const {title , description} = req.body

        if(!title || !description){
            return res.status(400).json({ message: "REQUIRED"})
        }
        const task = new Task({
            title,
            description
        })

        const new_task = await task.save();

        res.status(201).json({ message: "success", data: new_task})
    }
    catch{

    }
}