import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {} 

export default async function dbConnect() : Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "", {});
        
        connection.isConnected = db.connections[0].readyState;

        console.log('Database connected successfully',db);
        console.log('This is db.connections in dbConnect.ts', db.connections);
        
        
    } catch (error) {
        console.error('Error connecting to db', error);
        process.exit(1);
    }
}