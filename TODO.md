# Resolvio - Admin Dashboard UI/Analytics Upgrade

## Plan execution checklist

- [x] Gather understanding of current admin App.jsx/App.css, backend admin routes, auth middleware, and admin auth behavior.
- [x] Backend: add `GET /api/admin/analytics` route in `Backend/routes/admin.js` (counts + categoryStats).
- [ ] Admin: update `admin/src/App.jsx`
  - [x] Remove Analytics sidebar option entirely.
  - [x] Redesign Dashboard: top stat cards + Recharts PIE/BAR + top category card.
  - [x] Fetch analytics from backend and render real data.
  - [x] Add Home button on left side of admin profile section; redirect to `http://localhost:5173/`.
  - [x] Logout: clear localStorage token and redirect to `http://localhost:5173/`.
  - [ ] Do not break existing complaints/status updates and students list.
- [ ] Admin styling: update `admin/src/App.css` for modern SaaS analytics look.
- [x] Admin dependencies: add and install `recharts`.
- [ ] Testing: run backend + admin, verify login, complaints, students, dashboard charts, home redirect, logout redirect.

