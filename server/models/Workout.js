const mongoose = require('mongoose');

const count = (label) => ({ type: Number, min: [0, `${label} cannot be negative`], default: 0 });

const workoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    exercise: { type: String, required: [true, 'Exercise name is required'], trim: true, maxlength: [80, 'Exercise name is too long'] },
    sets: count('Sets'),
    reps: count('Reps'),
    duration: count('Duration'), // minutes
    calories: count('Calories'),
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);
