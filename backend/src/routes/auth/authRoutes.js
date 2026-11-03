import express from "express";
import  { registerUser, loginUser, logoutUser, getCurrentUser, forgotPassword, resetPassword, } from "../../controllers/auth/authController.js";
import { protect } from "../../middleware/authMiddleware.js"

const router = express.Router();

// Public auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getCurrentUser);

// Forgot & Reset Password routes
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);

export default router;