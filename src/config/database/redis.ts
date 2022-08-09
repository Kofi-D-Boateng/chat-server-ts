import * as redis from "redis";
import { CONFIG } from "../config";
const REDIS_URL: string = `redis://${CONFIG.REDIS_HOST}:${CONFIG.REDIS_PORT}`;
const CLIENT = redis.createClient({ url: REDIS_URL });
CLIENT.connect();

export default CLIENT;
