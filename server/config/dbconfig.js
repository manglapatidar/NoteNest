import mongoose from "mongoose"
import colors from "colors"

const connectDB = async ()=>{
    try {
        let conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`DB CONNECTION SUCCESS : ${conn.connection.name}`.bgGreen.black)
    } catch (error) {
        console.log(`DB CONNECTION FAILED :${error.message}`.bgRed.black)
    }
}
export default connectDB