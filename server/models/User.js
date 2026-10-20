const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: [60, 'Name is too long'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    // select: false keeps the hash out of normal queries; login asks for it explicitly.
    password: { type: String, required: true, select: false },
    age: { type: Number, min: [5, 'Age must be between 5 and 120'], max: [120, 'Age must be between 5 and 120'] },
    height: { type: Number, min: [50, 'Height must be between 50 and 260 cm'], max: [260, 'Height must be between 50 and 260 cm'] },
    weight: { type: Number, min: [20, 'Weight must be between 20 and 400 kg'], max: [400, 'Weight must be between 20 and 400 kg'] },
    goal: { type: String, enum: { values: ['lose', 'maintain', 'gain'], message: 'Goal must be lose, maintain or gain' }, default: 'maintain' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
