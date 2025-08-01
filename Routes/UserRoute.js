import express from "express";
import {

  deleteUser,
  followUser,
  getUser,
  updateUser,
  getAllUsers,
 
  unfollowUser
} from "../Controllers/Usercontroller.js";
import authMiddleWare from '../middleware/AuthMiddleware.js';

const router = express.Router();

// ❌ Remove this!
// router.get('/', async (req, res) => {
//   res.send("user route");
// });

// ✅ This will now correctly respond with user list
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', authMiddleWare,updateUser);
router.delete('/:id',authMiddleWare,deleteUser);
router.put('/:id/follow', authMiddleWare,followUser);
router.put('/:id/unfollow',authMiddleWare, unfollowUser);

export default router;
