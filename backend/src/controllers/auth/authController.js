import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import { sendEmail } from "../../config/email.js";

import { promisify } from "util";


//  @desc Register a new user 
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    // check if user filled all required fields
    if (!name || !email || !password) {
        res.status(400).json({
            success: false,
            message: "Please fill all required fields"
        });
        return;
    }

    // Validate password strength
    if (password.length < 6) {
        res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        })
        return;
    }

    // check if user already exits
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
        res.status(400).json({
            success: false,
            message: "User already exists"
        })
        return;
    }

    // create new user
    const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password,
        role: role
    })

    // respond with success message and user data
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    })
})

// @desc Login User


export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Find user and include password
    const user = await User.findOne({
        email: email.toLowerCase().trim(),
    }).select("+password");

    // 2. Check user and password
    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password.",
        });
    }

    // 3. Regenerate session
    const regenerateSession = promisify(req.session.regenerate)
        .bind(req.session);

    await regenerateSession();

    // 4. Store userId in session
    req.session.userId = user._id.toString();

    // 5. Save session
    const saveSession = promisify(req.session.save)
        .bind(req.session);

    await saveSession();

    // 6. Send response
    res.status(200).json({
        success: true,
        message: "User logged in successfully.",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
    });
});


// Logout user
export const logoutUser = asyncHandler(async (req, res) => {
    await new Promise((resolve, reject) => {
        req.session.destroy((error) => {
            if (error) reject(error);
            else resolve();
        })
    })

    res.clearCookie("smartshop.sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    res.status(200).json({
        success: true,
        message: "Logout successful."
    })
})

// Get current log-in user
export const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    })
})

// ForgotPassword
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({
        email: email.toLowerCase().trim(),
    });

    const message =
        "If a user with that email exists, a password reset link will be sent to the email address provided.";

    if (!user) {
        return res.status(200).json({
            success: true,
            message,
        });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset link
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Smart Shop - Password Reset",
            message: `
                <h2>Password Reset Request</h2>
                <p>Hello ${user.name},</p>
                <p>You requested to reset your password.</p>
                <p>Click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Your Password</a>
                <p>This link will expire in 3 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
            `,
        });

        return res.status(200).json({
            success: true,
            message,
        });

    } catch (error) {
        // Remove reset token if email sending fails
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        console.error("Email sending failed:", error.message);

        res.status(500);
        throw new Error("Email could not be sent. Please try again.");
    }
});

// Reset password
export const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = bcrypt
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    }).select('+resetPasswordToken +resetPasswordExpire');
    if (!user) {
        res.status(400).json({
            success: false,
            message: 'Invalid or expired password reset token.'
        })
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password reset successful. You can now log in with your new password.'
    })
})