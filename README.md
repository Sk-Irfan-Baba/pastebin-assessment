Pastebin-Lite – Full Stack Application

A secure, temporary text-sharing application inspired by Pastebin.
Built to handle high-concurrency scenarios with atomic database updates and deterministic testing capabilities.

Service Status URLs
Frontend (Deployed): https://your-frontend.vercel.app
Backend (Deployed): https://your-backend.vercel.app

Tech Stack
Backend:
- Python (FastAPI)
- SQLModel (SQLAlchemy)
- PostgreSQL (Neon)
- Jinja2 (HTML rendering)

Frontend:
- React
- Vite
- Tailwind CSS
- Axios

Persistence:
- PostgreSQL (Neon)
Chosen for reliable ACID compliance to safely handle race conditions on view counts.

Deployment:
- Vercel (Serverless Functions)

Project Structure

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
└── README.txt

Backend Setup (FastAPI)

1. Prerequisites
- Python 3.9+
- PostgreSQL database (Local or Cloud / Neon)

2. Installation

cd backend
python -m venv venv

Activate virtual environment

Windows:
.\venv\Scripts\activate

Mac/Linux:
source venv/bin/activate

Install dependencies:
pip install -r requirements.txt

3. Configuration

Create a .env file inside backend/

backend/.env

DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
TEST_MODE=0
BASE_URL=http://127.0.0.1:8000

Variable Notes:
DATABASE_URL:
PostgreSQL connection string.

TEST_MODE:
Set to 1 to enable deterministic testing via x-test-now-ms header (required for grader).

BASE_URL:
Must always point to the backend URL. This is used to generate /p/{id} links.

IMPORTANT IMPORT NOTE (LOCAL vs VERCEL)

For Vercel deployment, imports are written as:
from .models.model import Paste, PasteCreate

For local development, Python module resolution may require changing the import to:
from models.model import Paste, PasteCreate

If you encounter import errors locally, remove the leading dot before models.
This difference is expected and documented.

4. Run Backend Server

uvicorn api.main:app --reload

Verify:
Health Check:
http://127.0.0.1:8000/api/healthz

API Docs:
http://127.0.0.1:8000/docs

Frontend Setup (React + Vite)

1. Installation

cd frontend
npm install

2. Configuration

Create a file frontend/.env.local

VITE_API_URL=http://127.0.0.1:8000

VITE_API_URL must point to the backend base URL.

3. Run Frontend

npm run dev

UI available at:
http://localhost:5173

Critical Design Decisions

1. Hybrid Rendering Strategy

The application supports two viewing modes:

- GET /p/{id}
  Server-side rendered HTML via FastAPI + Jinja2.
  Required for automated grading and curl-based checks.

- GET /api/pastes/{id}
  JSON API consumed by the React frontend for interactive UI rendering.

2. Concurrency Safety (Race Conditions)

Problem:
In serverless environments, naive increments cause lost updates.

Solution:
PostgreSQL row-level locking using SELECT ... FOR UPDATE.

Result:
View counts decrement accurately even under simultaneous access.

3. Deterministic Time Testing

A custom time resolver get_now() is used.

When TEST_MODE=1:
- The backend respects the x-test-now-ms header.
- Allows the grader to simulate future time for TTL expiry.

4. Persistence Layer Choice

PostgreSQL was selected because:
- Vercel serverless functions are stateless.
- In-memory storage would be unreliable.
- PostgreSQL provides transactional guarantees and durability.

API Endpoints

GET    /api/healthz
Checks database connectivity.

POST   /api/pastes
Creates a new paste with optional ttl_seconds and max_views.

GET    /api/pastes/{id}
Returns JSON content and decrements view count.

GET    /p/{id}
Returns HTML content and decrements view count.

Deployment Notes

Backend (Vercel):
- Deployed as a FastAPI Serverless Function.
- Configured via vercel.json to route traffic to api/main.py.
- Required environment variables:
  DATABASE_URL
  TEST_MODE=1
  BASE_URL=https://your-backend.vercel.app

Frontend (Vercel):
- Deployed as a static Vite build.
- dist/ directory is not committed.
- Required environment variable:
  VITE_API_URL=https://your-backend.vercel.app
- SPA routing handled via vercel.json rewrites.

Security Notes

The following files must never be committed:
.env
.env.local
venv/
node_modules/

All secrets must be stored in environment variables.
