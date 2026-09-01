# DrishtiAI Monorepo Structure

This project uses a monorepo structure with separate backend and frontend packages.

## Project Layout

```
DrishtiAI/
├── backend/              # Node.js + Express server
│   ├── server/          # Express application
│   ├── server.js        # Entry point
│   ├── package.json
│   └── .env            # Backend environment variables
│
├── frontend/            # React + Vite application
│   ├── src/            # React components and pages
│   ├── public/         # Static assets
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── package.json        # Root monorepo config
└── README.md
```

## Quick Start

### Install Dependencies
```bash
npm install
```

This will install dependencies for both backend and frontend using npm workspaces.

### Run Development Servers

**Both Backend and Frontend:**
```bash
npm run dev
```

**Backend Only:**
```bash
npm run dev:backend
```

**Frontend Only:**
```bash
npm run dev:frontend
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Environment Setup

### Backend (.env)
Create `backend/.env` with required variables (see `backend/.env.example`)

### Frontend 
The frontend connects to the backend API via proxy at `http://localhost:5000` (configured in `vite.config.js`)

## Architecture

- **Backend**: Express.js server on port 5000
  - Handles API routes, authentication, database operations
  - Located in `backend/server/`

- **Frontend**: React app on port 5173
  - Built with Vite for fast development
  - Proxies `/api/*` calls to backend

## Dependencies Separation

- **Backend** uses: Express, Mongoose, JWT, bcryptjs, CORS
- **Frontend** uses: React, React Router, Recharts, Tailwind CSS, Vite
- **Root** manages workspaces and shared scripts

See individual `package.json` files for complete dependency lists.
