const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

const signToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

// Only these fields are ever sent to the browser (never the password hash).
const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  age: u.age,
  height: u.height,
  weight: u.weight,
  goal: u.goal,
});

const PROFILE_FIELDS = ['name', 'age', 'height', 'weight', 'goal'];

// POST /api/auth/register
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password, age, height, weight, goal } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    if (await User.exists({ email: String(email).toLowerCase().trim() })) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, age, height, weight, goal });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  })
);

// POST /api/auth/login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');
    if (!user || !(await bcrypt.compare(String(password), user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ token: signToken(user), user: publicUser(user) });
  })
);

// GET /api/auth/profile  (protected)
router.get(
  '/profile',
  auth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    res.json(publicUser(user));
  })
);

// PUT /api/auth/profile  (protected)
router.put(
  '/profile',
  auth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    PROFILE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field] === '' ? undefined : req.body[field];
    });
    await user.save();
    res.json(publicUser(user));
  })
);

module.exports = router;
