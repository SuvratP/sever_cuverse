import express from "express";
import { loginUser, registerUser } from "../Controllers/Authcontroller.js";

const router = express.Router()


router.post('/register', registerUser)
router.post('/login', loginUser)
export default router