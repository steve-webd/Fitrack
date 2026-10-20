const express = require('express');
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();
router.use(auth); // every workout route is private

// Whitelist the fields a client may set (so nobody can pass their own "user" value).
const pickFields = (body) => {
  const data = {};
  ['exercise', 'sets', 'reps', 'duration', 'calories', 'date'].forEach((key) => {
    if (body[key] !== undefined) data[key] = body[key];
  });
  return data;
};

// GET /api/workouts - the logged-in user's workouts, newest first
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const workouts = await Workout.find({ user: req.userId }).sort({ date: -1, createdAt: -1 });
    res.json(workouts);
  })
);

// POST /api/workouts - add a workout
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const workout = await Workout.create({ ...pickFields(req.body), user: req.userId });
    res.status(201).json(workout);
  })
);

// PUT /api/workouts/:id - update one of the user's workouts
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      pickFields(req.body),
      { new: true, runValidators: true }
    );
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json(workout);
  })
);

// DELETE /api/workouts/:id - remove one of the user's workouts
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json({ message: 'Deleted' });
  })
);

module.exports = router;
