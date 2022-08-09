import express, { Router } from "express";
import { ROUTES } from "../config/config";

const router: Router = express.Router();

router.post(ROUTES.USER_SETTINGS);
