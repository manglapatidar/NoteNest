import mongoose from "mongoose"
import colors from "colors"
import dns from "dns"

// Workaround for Node.js DNS resolution issues on some Windows networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async ()=>{
    try {
        let conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`DB CONNECTION SUCCESS : ${conn.connection.name}`.bgGreen.black)
    } catch (error) {
        console.log(`DB CONNECTION FAILED :${error.message}`.bgRed.black)
    }
}
export default connectDB