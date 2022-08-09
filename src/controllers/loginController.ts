import { randomBytes } from "crypto";
import { getUser } from "../utils/mongo/query";
import { CONFIG } from "../config/config";
import { Request, Response } from "express";

const _LoginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (
    !username ||
    !password ||
    username.trim().length == 0 ||
    password.trim().length == 0
  ) {
    res.status(401).json();
    return;
  }

  const foundUser = await getUser(username, password);

  if (!foundUser) {
    res.status(401).json();
    return;
  } else {
    const token = randomBytes(12).toString(
      CONFIG.TOKEN_CONFIG.TOKEN_STRING_FORMAT as BufferEncoding
    );
    res
      .status(200)
      .json({ token: token, key: foundUser.key, username: foundUser.username });
  }
};

export default _LoginUser;
