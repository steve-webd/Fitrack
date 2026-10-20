// Creates a demo account with six sample workouts, handy for testing and report screenshots.
//   npm run seed      then log in with  alex.morgan@example.com / FitTrack@123
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Workout = require('./models/Workout');

const DEMO_EMAIL = 'alex.morgan@example.com';
const DEMO_PASSWORD = 'FitTrack@123';

const workouts = [
  ['Push-ups', 3, 15, 10, 90, '2026-09-08T06:30:00.000Z'],
  ['Squats', 4, 12, 15, 120, '2026-09-07T06:10:00.000Z'],
  ['Pull-ups', 3, 8, 12, 100, '2026-09-05T06:20:00.000Z'],
  ['Lunges', 3, 12, 12, 85, '2026-09-04T06:15:00.000Z'],
  ['Burpees', 3, 10, 8, 110, '2026-09-02T06:25:00.000Z'],
  ['Jumping Jacks', 4, 30, 10, 80, '2026-09-01T06:05:00.000Z'],
];

(async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set. Copy .env.example to .env first.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: DEMO_EMAIL });
  if (existing) {
    await Workout.deleteMany({ user: existing._id });
    await User.deleteOne({ _id: existing._id });
  }

  const user = await User.create({
    name: 'Alex Morgan',
    email: DEMO_EMAIL,
    password: await bcrypt.hash(DEMO_PASSWORD, 10),
    age: 22,
    height: 175,
    weight: 70,
    goal: 'maintain',
  });

  await Workout.insertMany(
    workouts.map(([exercise, sets, reps, duration, calories, date]) => ({
      user: user._id, exercise, sets, reps, duration, calories, date: new Date(date),
    }))
  );

  console.log(`Seeded demo user ${DEMO_EMAIL} (password: ${DEMO_PASSWORD}) with ${workouts.length} workouts.`);
  await mongoose.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
