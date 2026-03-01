import mongoose from "mongoose";

const connect = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database Connected");
    } catch (error) {
        console.log(`Database Connection Failed: ${error.message}`);
        throw error;
    }
};

export default connect;
