import { MongoClient } from "mongodb";
import { CONFIG } from "../config";
const dbConnection: MongoClient = new MongoClient(CONFIG.MONGO_URI as string);
export { dbConnection };
