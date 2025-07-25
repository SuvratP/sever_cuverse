import express from "express";



import { createPost, deletePost, getPost,  getTimelinePosts,  likePost, updatePost } from "../Controllers/PostController.js";

const router = express.Router()



router.post('/', createPost)
router.get("/getPost/:id", getTimelinePosts)
router.get('/:id', getPost)

router.put('/:id', updatePost)
router.delete("/:id", deletePost)
router.put("/:id/like", likePost)

export default router;