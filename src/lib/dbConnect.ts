import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";

const DB_NAME = "secretMessageDb";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    // check if it is already connected to database 
    if(connection.isConnected){ 
        console.log("Already connected to database");
        return;
    }

    try { // try to connect to db 
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) ;

        connection.isConnected = db.connections[0].readyState;

        console.log("DB Connected Successfully");
        
    } catch (error) {
        console.log("Database connection failed", error);
        
        process.exit(1); // exit the connection in the case of any error
    }
}

export default dbConnect;