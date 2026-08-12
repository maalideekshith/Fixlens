\# FixLens



AI-powered bug reporting and analysis platform for developers.



FixLens helps developers report software bugs, attach screenshots, track issues, and use AI-powered analysis to understand bugs and identify possible solutions.



\## Live Demo



\- \*\*Frontend:\*\* https://fixlens-one.vercel.app/

\- \*\*Backend API:\*\* https://fixlens-exry.onrender.com

\- \*\*API Documentation:\*\* https://fixlens-exry.onrender.com/docs



\## Features



\- User registration and authentication

\- JWT-based authentication

\- Create and manage bug reports

\- Bug descriptions with expected and actual behavior

\- Steps to reproduce

\- Screenshot upload support

\- AI-powered bug analysis

\- Bug history and tracking

\- Dashboard with bug statistics

\- User settings

\- Responsive web interface

\- REST API with FastAPI

\- PostgreSQL database

\- Production deployment with Vercel and Render



\## AI-Powered Bug Analysis



FixLens can analyze an existing bug report using AI.



The analysis uses information such as:



\- Bug title

\- Description

\- Expected behavior

\- Actual behavior

\- Steps to reproduce



The system then generates an analysis that can help developers understand the possible cause and direction for fixing the issue.



\## Tech Stack



\### Frontend



\- React

\- TypeScript

\- Vite

\- Tailwind CSS

\- React Router

\- Axios

\- Lucide React



\### Backend



\- Python

\- FastAPI

\- SQLAlchemy

\- PostgreSQL

\- Pydantic

\- JWT

\- bcrypt



\### AI



\- OpenRouter-compatible LLM API

\- AI-powered bug analysis



\### Deployment



\- Vercel — Frontend

\- Render — Backend

\- PostgreSQL — Database



\## Project Structure



```text

FixLens/

├── backend/

│   ├── app/

│   │   ├── core/

│   │   ├── db/

│   │   ├── routers/

│   │   ├── schemas/

│   │   ├── services/

│   │   └── main.py

│   ├── requirements.txt

│   └── .gitignore

│

├── frontend/

│   ├── src/

│   │   ├── api/

│   │   ├── components/

│   │   ├── context/

│   │   ├── pages/

│   │   └── main.tsx

│   ├── package.json

│   └── vite.config.ts

│

├── .gitignore

└── README.md



Architecture

&#x20;                   ┌─────────────────────┐

&#x20;                   │      FixLens UI            │

&#x20;                   │   React + TypeScript       │

&#x20;                   └──────────┬──────────┘

&#x20;                                  │

&#x20;                                  │ REST API

&#x20;                                  ▼

&#x20;                   ┌─────────────────────┐

&#x20;                   │     FastAPI API            │

&#x20;                   │       Python               │

&#x20;                   └───────┬─────┬───────┘

&#x20;                              │     │

&#x20;                   ┌───────┘     └────────┐

&#x20;                   ▼                           ▼

&#x20;            ┌──────────────┐       ┌──────────────┐

&#x20;            │ PostgreSQL        │       │      AI / LLM    │

&#x20;            │   Database        │       │     Bug Analysis │

&#x20;            └──────────────┘       └──────────────┘



Local Development

Prerequisites:



Make sure you have installed:



Python 3.10+

Node.js

npm

PostgreSQL



Clone the repository:

git clone https://github.com/maalideekshith/Fixlens.git

cd Fixlens



Backend Setup:

cd backend



Create and activate a virtual environment.



Windows:



python -m venv venv

venv\\Scripts\\activate



Install dependencies:



pip install -r requirements.txt



Create a .env file:



DATABASE\_URL=your\_postgresql\_connection\_string

JWT\_SECRET=your\_secure\_jwt\_secret

JWT\_ALGORITHM=HS256

LLM\_API\_KEY=your\_llm\_api\_key

LLM\_MODEL=your\_llm\_model

Start the backend:



uvicorn app.main:app --reload



Backend will run at:



http://localhost:8000



API documentation:



http://localhost:8000/docs

Frontend Setup



Open another terminal:



cd frontend



Install dependencies:



npm install



Create a .env file:



VITE\_API\_URL=http://localhost:8000



Start the frontend:



npm run dev



Frontend will run at:



http://localhost:5173

Environment Variables



Never commit environment variables containing secrets.



Backend

DATABASE\_URL=

JWT\_SECRET=

JWT\_ALGORITHM=

LLM\_API\_KEY=

LLM\_MODEL=

Frontend

VITE\_API\_URL=



The .env files are ignored by Git and should remain private.



API Overview

Authentication

POST /auth/register

POST /auth/login

GET  /auth/me

Bugs

GET    /bugs

POST   /bugs

GET    /bugs/{bug\_id}

PUT    /bugs/{bug\_id}

DELETE /bugs/{bug\_id}

POST   /bugs/{bug\_id}/analyze

Health Check

GET /health



Interactive API documentation is available through FastAPI Swagger:



https://fixlens-exry.onrender.com/docs



Deployment

Frontend



The React frontend is deployed using Vercel.



Production URL:



https://fixlens-one.vercel.app/



Backend



The FastAPI backend is deployed using Render.



Production URL:



https://fixlens-exry.onrender.com



The backend connects to a production PostgreSQL database and uses environment variables for sensitive configuration.



Security



FixLens uses:



JWT authentication

Password hashing with bcrypt

Protected API endpoints

User-specific bug access

Environment variables for secrets

CORS configuration for production frontend access



Sensitive credentials are never stored in the repository.



Future Improvements:

AI-generated fix suggestions

Automatic bug severity classification

Bug priority prediction

Duplicate bug detection

Team collaboration

Comments and discussions

Email notifications

Advanced analytics

GitHub issue integration

CI/CD automation

Author



Maali Deekshith



Computer Science Engineering Student



GitHub: https://github.com/maalideekshith







