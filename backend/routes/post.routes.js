import express from 'express';
import { protectroute } from '../middleware/protectroute.js';
import { createPost, deletePost, commentOnPost, likeUnlikePost } from '../controllers/post.controller.js';


const router = express.Router();

router.post("/create", protectroute, createPost);
router.post('/like/:id', protectroute, likeUnlikePost)
router.post('/comment/:id', protectroute, commentOnPost)
router.delete("/:id", protectroute, deletePost)


export default router;
 