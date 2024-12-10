import express from 'express';
import { protectroute } from '../middleware/protectroute.js';
import { getUserprofile, followUnfollowUser, getSuggestedUsers, updateUser } from '../controllers/user.controller.js';
const router = express.Router();

router.get('/profile/:username', protectroute, getUserprofile );
router.get('/suggested', protectroute, getSuggestedUsers);
router.post('/follow/:id', protectroute, followUnfollowUser);
router.post('/update', protectroute, updateUser);


export default router;