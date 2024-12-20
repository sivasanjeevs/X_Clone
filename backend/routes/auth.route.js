import express from "express";
import { getMe, logout, login, signup } from "../controllers/auth.controller.js";
import { protectroute } from "../middleware/protectroute.js";
const router = express.Router();

router.get('/me', protectroute, getMe);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;