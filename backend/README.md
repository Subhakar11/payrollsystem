
# Payroll Management System (MERN) with PDF Salary Slips

## Features
- Auth (JWT): Login/Signup, Admin & Employee roles
- Salary Slips: Admin can generate/update; employees can view & **download PDF**
- Expenses: Employee submit monthly expenses; Admin approve/reject
- Dashboards: Employee chart (Salary vs Expenses), Admin totals
- Clean UI with Tailwind

## Quick Start
### Backend
```
cd backend
cp .env.example .env
# set MONGO_URI, JWT_SECRET, CLIENT_ORIGIN, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run seed:admin
npm run dev
```
### Frontend
```
cd frontend
cp .env.example .env
npm install
npm run dev
```
Login with the admin you seeded. Employees can self-signup.
