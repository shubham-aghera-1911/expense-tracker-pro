# Expense Tracker Pro

A premium, multi-currency expense tracker built on the MERN stack (MongoDB, Express, React, Node.js), with a glassmorphism UI, authentication, charts, budget alerts, PDF exports, and full dark/light mode.

## Features

- **Authentication** — JWT-based register/login, protected routes, password change
- **Multi-currency** — log an expense in any currency (INR, USD, EUR, GBP, JPY, AUD, CAD); switch your display currency anytime and everything converts live
- **Dashboard** — this month's spend, transaction count, budget usage, 6-month trend, category breakdown, recent expenses
- **Expenses** — full CRUD, search, category filter, pagination
- **Budget alerts** — a banner warns you at 80% and 100%+ of your monthly budget
- **Reports** — monthly summary, category pie chart, daily bar chart, 6-month trend, one-click **PDF export**
- **Settings** — profile, base currency, monthly budget, password, dark/light mode toggle
- **Premium glass UI** — frosted-glass cards, aurora gradient background, smooth Framer Motion animations, loading skeletons, fully responsive down to mobile

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, PDFKit
**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Recharts, React Router, Axios, react-hot-toast, lucide-react

## Project Structure

```
expense-tracker-pro/
├── backend/
│   ├── config/db.js
│   ├── controllers/       # auth, expense, budget, report logic
│   ├── middleware/        # auth (JWT) + centralized error handler
│   ├── models/            # User, Expense, Budget (Mongoose schemas)
│   ├── routes/
│   ├── utils/             # token generation, currency conversion
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── components/    # GlassCard, Loader, Sidebar, Navbar, modals, charts...
    │   ├── context/       # Auth, Currency, Theme
    │   ├── pages/          # Landing, Login, Register, Dashboard, Expenses, Reports, Settings
    │   └── utils/currencies.js
    └── index.html
```

## Getting Started

### Prerequisites

- Node.js 18+ (needed for native `fetch`, used by the currency conversion utility)
- MongoDB running locally, or a connection string from MongoDB Atlas

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense-tracker-pro
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

`EXCHANGE_RATE_API_URL` is already pre-filled with a free, keyless exchange rate API. If it's ever unreachable, the app automatically falls back to built-in static rates, so currency conversion always works even without an internet connection.

Run it:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

The API boots on `http://localhost:5000`. Hit `GET /api/health` to confirm it's running.

### 2. Frontend setup

In a separate terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

`.env` just needs:

```
VITE_API_URL=http://localhost:5000/api
```

Run it:

```bash
npm run dev
```

Visit `http://localhost:5173`. Vite is also configured to proxy `/api` to `http://localhost:5000`, so it works even without setting `VITE_API_URL`.

### 3. Create an account

Register from the landing page, pick your preferred base currency, and start adding expenses. Everything — including the currency you originally logged an expense in — is preserved, so switching your display currency later never loses information.

## Notes on Data

This project ships with **zero seed/mock data** — your database starts empty. Register a user and everything (expenses, budgets, reports) builds up from there.

## Building for Production

```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm run build   # outputs to frontend/dist
```

Serve `frontend/dist` with any static host (Vercel, Netlify, Nginx, etc.) and point `VITE_API_URL` at your deployed backend.

## License

MIT — free to use and modify for personal or commercial projects.
