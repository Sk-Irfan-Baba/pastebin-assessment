# Pastebin-Lite – Full Stack Application

A secure, temporary text-sharing application inspired by Pastebin.  
Designed to handle high-concurrency scenarios with atomic database updates and deterministic testing capabilities.

---

## Service URLs (Production)

- **Frontend (Vercel):** https://your-frontend.vercel.app  
- **Backend (Vercel):** https://your-backend.vercel.app  

---

## Tech Stack

### Backend
- Python
- FastAPI
- SQLModel (SQLAlchemy)
- PostgreSQL (Neon)
- Jinja2 (server-side HTML rendering)
- Uvicorn

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Persistence
- PostgreSQL (Neon)  
Chosen for ACID compliance and safe handling of race conditions on view counters.

### Deployment
- Vercel (Serverless Functions for backend, Static hosting for frontend)

---

## Project Structure

```
pastebin-assessment/
│
├── backend/
│   ├── api/
│   │   ├── main.py
│   │   └── models/
│   │       └── model.py
│   ├── templates/
│   ├── vercel.json
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── vercel.json
│   └── .env.local
│
└── README.md
```

---

## Backend Setup (FastAPI)

### 1. Prerequisites
- Python 3.9+
- PostgreSQL database (Local or Cloud / Neon)
- pip

### 2. Installation

```bash
cd backend
python -m venv venv
```

Activate virtual environment:

**Windows (PowerShell)**
```powershell
.\venv\Scripts\activate
```

**Mac/Linux**
```bash
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

---

### 3. Environment Configuration

Create a `.env` file inside the `backend/` directory  
(**Do not commit this file**)

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
TEST_MODE=0
BASE_URL=http://127.0.0.1:8000
```

#### Variable Explanation

- **DATABASE_URL**  
  PostgreSQL connection string.

- **TEST_MODE**  
  Set to `1` to enable deterministic time handling via `x-test-now-ms` header (required for grading).

- **BASE_URL**  
  Must always point to the **backend URL**.  
  Used to generate `/p/{id}` shareable links.

---

### Important Import Note (Local vs Vercel)

For **Vercel deployment**, imports are written as:

```python
from .models.model import Paste, PasteCreate
```

For **local development**, Python module resolution may require:

```python
from models.model import Paste, PasteCreate
```

If you encounter import errors locally, remove the leading dot before `models`.  
The dotted import is intentionally kept for Vercel deployment.

---

### 4. Run Backend Server

```bash
uvicorn api.main:app --reload
```

#### Verification

- Health check  
  http://127.0.0.1:8000/api/healthz

- API documentation  
  http://127.0.0.1:8000/docs

- HTML paste view  
  http://127.0.0.1:8000/p/{paste_id}

---

## Frontend Setup (React + Vite)

### 1. Installation

```bash
cd frontend
npm install
```

---

### 2. Environment Configuration

Create a `.env.local` file inside `frontend/`  
(**Do not commit this file**)

```env
VITE_API_URL=http://127.0.0.1:8000
```

- **VITE_API_URL** must point to the backend base URL.

---

### 3. Run Frontend

```bash
npm run dev
```

Frontend will be available at:

```
http://localhost:5173
```

---

## Critical Design Decisions

### 1. Hybrid Rendering Strategy

- **GET /p/{id}**  
  Server-side rendered HTML via FastAPI + Jinja2.  
  Required for automated graders and curl-based validation.

- **GET /api/pastes/{id}**  
  JSON API consumed by the React frontend.

---

### 2. Concurrency Safety

- PostgreSQL row-level locking using:
  ```
  SELECT ... FOR UPDATE
  ```
- Ensures accurate view counting under concurrent access.

---

### 3. Deterministic Time Testing

- When `TEST_MODE=1`, the backend respects the `x-test-now-ms` header.
- Allows graders to simulate future time for TTL expiry.

---

### 4. Persistence Layer

- PostgreSQL is required due to the stateless nature of serverless functions.
- Provides transactional guarantees and durability.

---

## API Endpoints

| Method | Endpoint              | Description                                  |
|------|----------------------|----------------------------------------------|
| GET  | /api/healthz          | Checks database connectivity                 |
| POST | /api/pastes           | Creates a new paste                          |
| GET  | /api/pastes/{id}      | Returns JSON and decrements view count       |
| GET  | /p/{id}               | Returns HTML and decrements view count       |

---

## Deployment Notes

### Backend (Vercel)
- Deployed as a FastAPI serverless function
- Routing configured via `vercel.json`
- Environment variables:
  - `DATABASE_URL`
  - `TEST_MODE=1`
  - `BASE_URL=https://your-backend.vercel.app`

### Frontend (Vercel)
- Deployed as a static Vite build
- `dist/` directory is not committed
- Environment variable:
  - `VITE_API_URL=https://your-backend.vercel.app`
- SPA routing handled via `vercel.json` rewrites

---

## Security Notes

The following files must never be committed:

```
.env
.env.local
venv/
node_modules/
```

All secrets must be stored using environment variables.
