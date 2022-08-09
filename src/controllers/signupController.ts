import { Request, Response } from "express";
import { addNewUser } from "../utils/mongo/query";

const createNewUser = async (req: Request, res: Response) => {
  const { username, email, password, dob } = req.body;
  if (
    username.trim().length <= 0 ||
    email.trim().length <= 0 ||
    password.trim().length <= 0 ||
    dob.trim().length <= 0
  ) {
    res.status(400);
  }
  const result: { wasSuccessful: boolean; msg: string } = await addNewUser(
    email,
    username,
    password,
    dob
  );
  if (result.wasSuccessful) {
    res.status(200).json(result.msg);
  } else if (
    result.msg === "Email is taken" ||
    result.msg === "Username is taken"
  ) {
    res.status(401).json(result.msg);
  } else {
    res.status(400).json(result.msg);
  }
};
export default createNewUser;
