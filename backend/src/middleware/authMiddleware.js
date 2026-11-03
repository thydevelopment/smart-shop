
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// Protect routes - only logged-in users can access
export const protect = asyncHandler(async (req, res, next) => {

    // 1. Get userId from session
    const userId = req.session?.userId;

    if (!userId) {
        res.status(401);
        throw new Error("Please login to access this resource.");
    }

    // 2. Find user in database
    const user = await User.findById(userId);

    if (!user) {
        req.session.destroy(() => {});

        res.status(401);
        throw new Error("User not found. Please login again.");
    }

    // 3. Attach user to request
    req.user = user;

    // 4. Continue to next middleware/controller
    next();
});
