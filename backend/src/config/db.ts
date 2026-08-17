import mongoose from 'mongoose'

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI!)
        console.log('database connected successfully')
    }
    catch(error){
        console.log(process.env.MONGODB_URI);
        console.error('Failed to connect to mongodb', error)
        process.exit(1) //exit in failure
    }
}
export default connectDb