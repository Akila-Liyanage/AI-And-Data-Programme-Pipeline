# AI & Data Programme Project Management System

An initial project setup for the AI & Data Programme Project Management System, featuring a React + TypeScript frontend built with Vite and Tailwind CSS, and a Node.js + Express + TypeScript backend configured with MongoDB and Mongoose.

## Tech Stack

### Frontend
- **React** (v19)
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **ESLint**

### Backend
- **Node.js**
- **Express.js**
- **TypeScript**
- **Mongoose**
- **dotenv**
- **CORS**

### Database
- **MongoDB**

---

## Project Structure

```
ai-data-project-management/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm
- MongoDB instance (Local or MongoDB Atlas)

---

### Environment Setup

Create a `.env` file in the `backend/` directory based on `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

> **Note:** Do not hardcode or commit database credentials. Ensure `backend/.env` is ignored by git.

---

### Frontend Setup & Run Commands

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```

---

### Backend Setup & Run Commands

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server with ts-node-dev
npm run dev

# Build TypeScript to dist/
npm run build

# Start production server
npm run start
```

---

### Verifying MongoDB Connection

1. Set a valid MongoDB URI in `backend/.env`, for example:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/ai-data-project-management
   ```
2. Run the backend development server:
   ```bash
   cd backend
   npm run dev
   ```
3. Check the console output:
   - **Success:** `MongoDB Connected successfully to <host>`
   - **Failure:** `MongoDB connection error: <error details>`
4. Test the health-check endpoint:
   - Open browser or run `curl http://localhost:5000/`
   - Expected Response:
     ```json
     {
       "status": "OK",
       "message": "AI & Data Programme Project Management System API is running",
       "timestamp": "..."
     }
     ```
