import mongoose  from "mongoose";

const connectMongoDB = async() => {
    try
    {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`connected to database : ${conn.connection.host}`);
    }
    catch(error)
    {
        console.error(`Database not connected : ${error.message}`);
        process.exit(1);
    }
}
export default connectMongoDB;