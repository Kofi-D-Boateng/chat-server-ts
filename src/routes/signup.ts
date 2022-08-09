import express, { Router } from "express";
import createNewUser from "../controllers/signupController";

const router: Router = express.Router();

router.put("/create-user", createNewUser);

export default router;
