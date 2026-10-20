# FitTrack

A full stack fitness tracker built with the MERN stack: **M**ongoDB, **E**xpress, **R**eact and **N**ode.js.
Users register, log in, record workouts, see their BMI and track progress on a dashboard.

```
fittrack/
├── server/                 Express API
│   ├── index.js            App setup, CORS, MongoDB connection
│   ├── models/             User.js, Workout.js (Mongoose schemas)
│   ├── routes/             auth.js, workouts.js
│   ├── middleware/         auth.js (JWT check), errorHandler.js, asyncHandler.js
│   ├── seed.js             Demo account and sample workouts
│   └── .env.example
└── client/                 React app (Vite)
    └── src/
        ├── pages/          Login, Register, Dashboard, AddWorkout, EditWorkout, History, Profile
        ├── components/     Layout, WorkoutForm, WorkoutList, BmiGauge, ...
        ├── context/        AuthContext.jsx (login state and token)
        ├── api.js          Axios instance that attaches the JWT
        └── utils.js        BMI calculation and formatting helpers
```

## What you need

- Node.js 18 or newer
- MongoDB: either [MongoDB Community](https://www.mongodb.com/try/download/community) running locally, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## Run it locally

Use two terminals.

**1. API (terminal 1)**

```bash
cd server
npm install
cp .env.example .env        # on Windows: copy .env.example .env
```

Open `.env` and set `JWT_SECRET` to any long random string. For local MongoDB the default `MONGO_URI` already works; for Atlas paste your connection string instead.

```bash
npm run seed                # optional: adds a demo account with 6 workouts
npm run dev                 # API on http://localhost:5000
```

**2. React app (terminal 2)**

```bash
cd client
npm install
npm run dev                 # app on http://localhost:3000
```

Open http://localhost:3000. If you ran the seed, log in with:

| Email | Password |
|---|---|
| alex.morgan@example.com | FitTrack@123 |

The demo data (height 175 cm, weight 70 kg, six workouts totalling 585 kcal) gives a BMI of 22.9, the same example used in the report.

## API

All workout routes need the header `Authorization: Bearer <token>`. Log in to get a token.

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| POST | `/api/auth/register` | Create an account, returns `token` and `user` | No |
| POST | `/api/auth/login` | Log in, returns `token` and `user` | No |
| GET | `/api/auth/profile` | Get the logged-in user's profile | Yes |
| PUT | `/api/auth/profile` | Update name, age, height, weight, goal | Yes |
| GET | `/api/workouts` | List the user's workouts, newest first | Yes |
| POST | `/api/workouts` | Add a workout | Yes |
| PUT | `/api/workouts/:id` | Update a workout | Yes |
| DELETE | `/api/workouts/:id` | Delete a workout | Yes |
| GET | `/api/health` | Check the API is running | No |

The profile routes and `/api/health` are additions to the six endpoints in the report's table 9.5. They support the profile page the report describes.

Quick test with curl:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex.morgan@example.com","password":"FitTrack@123"}'

curl http://localhost:5000/api/workouts -H "Authorization: Bearer <paste token>"
```

In Postman, the same requests work: set the method and URL, put the JSON in the Body tab (raw, JSON), and add the token on the Authorization tab as a Bearer Token.

## Deploy

1. **Database:** create an Atlas cluster, add a database user, allow network access, and copy the connection string.
2. **API** (Render, Railway or similar): root directory `server`, build command `npm install`, start command `npm start`. Set the environment variables `MONGO_URI`, `JWT_SECRET` and `CLIENT_URL` (the web address of your deployed front-end).
3. **React app** (Netlify, Vercel or similar): root directory `client`, build command `npm run build`, publish directory `dist`. Set `VITE_API_URL` to your API address followed by `/api`, for example `https://fittrack-api.onrender.com/api`. The `_redirects` and `vercel.json` files make page refreshes work.

Never commit `.env`. The `.gitignore` already excludes it.

## Notes

- Passwords are hashed with bcryptjs and never returned by the API. Sessions use a JWT that expires after one day.
- Each user can only see and change their own workouts.
- The report's section 10.1 mentions `create-react-app`. This project uses Vite instead, because create-react-app is no longer maintained. The React code works the same way. If you want the report to match, change that command to `npm create vite@latest client -- --template react`.
