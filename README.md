# Project Tracker — MERN Interactive Dynamic Task Dashboard

A full-stack MERN (MongoDB · Express · React · Node.js) project tracker. Track your dev projects with name, stack, status, and GitHub link. Supports full **CRUD** via an async React dashboard.

## Tech Stack

| Layer    | Tech                       |
|----------|----------------------------|
| Frontend | React 18 + Vite            |
| Backend  | Node.js + Express 4        |
| Database | MongoDB + Mongoose 8       |
| Styling  | Vanilla CSS (CSS Variables)|

---

## Prerequisites

- **Node.js** ≥ 18
- **MongoDB Community Server** running locally on default port `27017`
  - Download: https://www.mongodb.com/try/download/community
  - Or set a free Atlas URI in `.env`

---

## Setup & Run

### 1. Clone & install all dependencies
```bash
# Install backend + frontend in one shot
npm run install:all
```

### 2. Configure environment (optional)
Edit `.env` to point at your MongoDB instance:
```
MONGO_URI=mongodb://127.0.0.1:27017/project_tracker
PORT=5000
```

### 3. Start (both servers simultaneously)
```bash
npm run dev
```
- **Backend** → `http://localhost:5000`
- **Frontend** → `http://localhost:5173`

---

## Folder Structure

```
task3/
├── models/
│   └── Project.js          ← Mongoose schema & model
├── routes/
│   └── projects.js         ← Express CRUD router
├── client/                 ← Vite + React SPA
│   ├── src/
│   │   ├── api/projects.js ← async/await fetch layer
│   │   ├── components/
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── ProjectList.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js      ← proxies /api → :5000
│   └── package.json
├── .env                    ← MONGO_URI, PORT
├── .gitignore
├── package.json
├── server.js               ← Express entry point
└── README.md
```

---

## Data Model

| Field         | Type   | Notes                                      |
|---------------|--------|--------------------------------------------|
| `_id`         | ObjectId | Auto-generated MongoDB ID               |
| `name`        | String | **Required**, max 100 chars                |
| `stack`       | String | Comma-separated, e.g. `"React, Node.js"`   |
| `status`      | String | `planning` \| `in-progress` \| `completed` |
| `github_url`  | String | Optional, must start with `http://`        |
| `description` | String | Optional, max 1000 chars                   |
| `createdAt`   | Date   | Auto-managed by Mongoose                   |
| `updatedAt`   | Date   | Auto-managed by Mongoose                   |

---

## REST API Reference

Base path: `/api/projects`

| Method | Endpoint             | Description                                   |
|--------|----------------------|-----------------------------------------------|
| GET    | `/api/health`        | Health check                                  |
| GET    | `/api/projects`      | List all projects (`?status=` filter optional)|
| GET    | `/api/projects/:id`  | Get single project                            |
| POST   | `/api/projects`      | Create project                                |
| PUT    | `/api/projects/:id`  | Update project (partial — send only changed fields) |
| DELETE | `/api/projects/:id`  | Delete project                                |

### Example cURL calls

```bash
# Create
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Rabta","stack":"Flutter, Firebase","status":"in-progress","github_url":"https://github.com/user/rabta"}'

# List all
curl http://localhost:5000/api/projects

# Filter by status
curl "http://localhost:5000/api/projects?status=completed"

# Update
curl -X PUT http://localhost:5000/api/projects/<ID> \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'

# Delete
curl -X DELETE http://localhost:5000/api/projects/<ID>
```

---

## UI Features

- **Stats bar** — live counts for Total / Planning / In-Progress / Completed
- **Filter tabs** — click to filter the card grid by status
- **Add Project** — modal form with validation
- **Edit** — pre-filled modal, partial updates only
- **Delete** — confirmation dialog before removal
- **Status badges** — color-coded pills (indigo / amber / emerald)
- **Stack tags** — auto-split on comma
- **GitHub links** — clickable on each card
- **Toast notifications** — success/error feedback
- **Responsive** — mobile-friendly grid layout
