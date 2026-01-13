import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getMe);

// @route   GET api/auth/google
// @desc    Auth with Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET api/auth/google/callback
// @desc    Google auth callback
router.get(
  '/google/callback',
  (req, res, next) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
    passport.authenticate('google', { 
        failureRedirect: `${frontendUrl}/login`, 
        session: false 
    })(req, res, next);
  },
  (req, res) => {
    // Generate token
    const payload = {
      user: {
        id: req.user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        // Redirect to frontend with token
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
            
        res.redirect(`${frontendUrl}?token=${token}`);
      }
    );
  }
);

export default router;
