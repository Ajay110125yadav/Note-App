import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * body: { name, email, password }
 */

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try{
      // check if user user
      let existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: "Email already registered" })

        // hash password

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        
        // create user

        const user = new User({ name, email, password: hashed });
        await user.save();

        // create token
        const payload = { id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET || "change_this_secret", { expiresIn: "7d" });

        // return token + user info (except password)
        res.status(201).json({
          token,
          user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt},
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
  }
);

export default router;