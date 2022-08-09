import express, { Router } from "express";
import { ROUTES } from "../config/config";
import _LoginUser from "../controllers/loginController";
const router: Router = express.Router();

router.post(ROUTES.USER_LOGIN, _LoginUser);

export default router;
