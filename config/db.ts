import mongoose from "mongoose";
import { Db, MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

dotenv.config({ 
  path: '.env.local'
});

let cachedClient: typeof mongoose;

const connectMongo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("connecting: " + (process.env.LOCAL_ENV_MONGO_URI || "mongodb+srv://cluster0.4sdcp.mongodb.net/jotes-main?authSource=%24external&authMechanism=MONGODB-AWS"));

    if (!cachedClient) {
      const client = await mongoose.connect(process.env.LOCAL_ENV_MONGO_URI || "mongodb+srv://cluster0.4sdcp.mongodb.net/jotes-main?authSource=%24external&authMechanism=MONGODB-AWS");
      cachedClient = client;
      console.log("connected");
    } else {
      console.log("connected cache");
    }

    // return cachedClient;

    next();

  } catch (error: unknown) {
    console.log("fail " + (error as Error).message);
    // client.close();
    mongoose.disconnect();
    process.exit();
  }
};

export default connectMongo;
