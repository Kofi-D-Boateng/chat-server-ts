import express, { Router } from "express";
import { ROUTES } from "../config/config";
import { createRoom, findRoom } from "../controllers/roomController";
const router: Router = express.Router();

router.get(ROUTES.FIND_ROOM, findRoom);
router.post(ROUTES.CREATE_ROOM, createRoom);

export default router;
