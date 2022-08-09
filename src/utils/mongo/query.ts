import bcrypt from "bcrypt";
import { dbConnection } from "../../config/database/mongodb";
import { CONFIG } from "../../config/config";
import {
  Collection,
  Db,
  Document,
  MongoInvalidArgumentError,
  WithId,
} from "mongodb";
import { User } from "../../classes/mongo/user";

const userRef: User = new User("", "", "", "", "", "");

const getUser = async (username: string, password: string) => {
  try {
    console.log(userRef);
    await dbConnection.connect();
    console.log("Connected to db....");
    const GETDB = dbConnection.db(CONFIG.MONGO_DB_NAME);
    if (GETDB.databaseName !== CONFIG.MONGO_DB_NAME) {
      throw new Error(MongoInvalidArgumentError.toString());
    }
    const USER = GETDB.collection(CONFIG.USERS_COLLECTION as string);

    if (USER.collectionName !== CONFIG.USERS_COLLECTION) {
      throw new Error(MongoInvalidArgumentError.toString());
    }

    const SEARCH = await USER.findOne({ username: username });
    if (!SEARCH) {
      return;
    }

    userRef.key = SEARCH.key;
    userRef.password = SEARCH.password;
    userRef.username = SEARCH.username;

    const PWCHECK = await bcrypt.compare(password, userRef.password);

    if (PWCHECK) {
      return userRef;
    }
  } catch (error) {
    console.log(error);
    return userRef;
  }
};

const addNewUser = async (
  email: string,
  username: string,
  password: string,
  dob: string
) => {
  try {
    await dbConnection.connect();
    console.log("Connected to db....");
    const GETDB: Db = dbConnection.db(CONFIG.MONGO_DB_NAME);
    GETDB.databaseName;
    if (GETDB.databaseName !== CONFIG.MONGO_DB_NAME) {
      throw new Error(MongoInvalidArgumentError.toString());
    }
    const USER: Collection<Document> = GETDB.collection(
      CONFIG.USERS_COLLECTION as string
    );

    if (USER.collectionName !== CONFIG.USERS_COLLECTION) {
      throw new Error(MongoInvalidArgumentError.toString());
    }
    const SEARCH: WithId<Document>[] = await USER.find({
      $or: [{ email: email }, { username: username }],
    }).toArray();

    if (SEARCH.length > 0) {
      SEARCH.forEach((s) => {
        if (s.username === username) {
          throw new Error("Username is taken.");
        }
        if (s.email === email) {
          throw new Error("Email is taken.");
        }
      });
    }

    const hashedPassword: string = await bcrypt.hash(
      password,
      CONFIG.PASSWORD_SALT_ROUNDS
    );
    userRef.username = username;
    userRef.email = email;
    userRef.password = hashedPassword;
    userRef.createdAt = new Date().toISOString();
    userRef.dob = dob;
    await USER.insertOne(userRef).catch(() => {
      throw new Error(`Failed to insert`);
    });
    return { wasSuccessful: true, msg: "done" };
  } catch (error) {
    if (error === "Email is taken") {
      return { wasSuccessful: false, msg: "Email is taken." };
    } else {
      return { wasSuccessful: false, msg: "Username is taken." };
    }
  }
};

export { getUser, addNewUser };
