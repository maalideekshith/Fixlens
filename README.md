
# FixLens

AI-powered bug reporting and analysis platform for developers.

FixLens helps developers report, track, and analyze software bugs in one place. Create detailed bug reports with expected and actual behavior, attach screenshots, and use AI-powered analysis to understand potential causes and debugging directions.

Built for developers who want a faster and smarter way to manage software issues.

## 🛠️ Technology & Deployment

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.141-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![AI](https://img.shields.io/badge/AI-LLM%20Powered-8B5CF6?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)
## Demo

🌐 **Live Application:** https://fixlens-one.vercel.app/

📚 **API Documentation:** https://fixlens-exry.onrender.com/docs

🔗 **Backend API:** https://fixlens-exry.onrender.com

## 📸 Screenshots

### 🔐 Login

[![FixLens Login](https://raw.githubusercontent.com/maalideekshith/Fixlens/main/screenshots/login.png)](https://github.com/maalideekshith/Fixlens/blob/main/screenshots/login.png)

### 🏠 Dashboard

[![FixLens Dashboard](https://raw.githubusercontent.com/maalideekshith/Fixlens/main/screenshots/Dashboard_Screenshot.png)](https://github.com/maalideekshith/Fixlens/blob/main/screenshots/Dashboard_Screenshot.png)

### 🐞 Bug Management

[![FixLens Bugs](https://raw.githubusercontent.com/maalideekshith/Fixlens/main/screenshots/Bugs_Screenshot.png)](https://github.com/maalideekshith/Fixlens/blob/main/screenshots/Bugs_Screenshot.png)

### 📋 Bug Details and AI Bug Details

[![FixLens Bug Details](https://raw.githubusercontent.com/maalideekshith/Fixlens/main/screenshots/BugDetails1_Screenshoot.png)](https://github.com/maalideekshith/Fixlens/blob/main/screenshots/BugDetails1_Screenshoot.png)



[![FixLens AI Analysis](https://raw.githubusercontent.com/maalideekshith/Fixlens/main/screenshots/BugDetails2_Screenshoot.png)](https://github.com/maalideekshith/Fixlens/blob/main/screenshots/BugDetails2_Screenshoot.png)
## Features

- 🔐 JWT-based user authentication
- 🐞 Create, update, view, and delete bug reports
- 📝 Capture expected behavior, actual behavior, and reproduction steps
- 📸 Attach screenshots to bug reports
- 🤖 AI-powered bug analysis
- 📊 Dashboard with bug statistics and recent issues
- 👤 User-specific bug access and protected API endpoints
- ⚡ Responsive React interface with FastAPI REST API


## How It Works

FixLens streamlines the entire bug-reporting workflow by combining **secure bug management** with **AI-powered analysis**.

### 🐞 1. Report

Create a detailed bug report with:

- 📝 Bug description
- 🎯 Expected behavior
- ⚠️ Actual behavior
- 🔄 Steps to reproduce
- 📸 Screenshots

⬇️

### 🔐 2. Secure

The **React frontend** sends the report to the **FastAPI backend**, where JWT authentication protects user accounts and bug data.

⬇️

### 🗄️ 3. Store

Bug reports are securely stored in **PostgreSQL**, allowing developers to track and manage their issues.

⬇️

### 🤖 4. Analyze

FixLens sends the bug information to the **AI service**, which analyzes the issue and provides possible causes and useful debugging insights.

⬇️

### 💡 5. Resolve

The AI-generated analysis is returned to the dashboard, helping developers **understand, investigate, and resolve bugs faster**.

### 🚀 Workflow

**🐞 Report → 🔐 Authenticate → 🗄️ Store → 🤖 Analyze → 💡 Resolve**

> **FixLens turns detailed bug reports into actionable AI-powered insights, helping developers spend less time diagnosing problems and more time solving them.**
## 🛠️ Tech Stack

### 🎨 Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-API-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### ⚙️ Backend

![Python](https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.141-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-2-E92063?style=for-the-badge&logo=pydantic&logoColor=white)

### 🗄️ Database & Security

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Bcrypt-Password_Hashing-4EAA25?style=for-the-badge)

### 🤖 AI

![AI](https://img.shields.io/badge/AI-Powered-8B5CF6?style=for-the-badge)
![LLM](https://img.shields.io/badge/LLM-Bug_Analysis-FF6F00?style=for-the-badge)

### ☁️ Deployment

![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render&logoColor=black)

# 🚀 Run Locally

Get FixLens running locally in a few simple steps.

## 🧰 Prerequisites

Make sure you have the following installed:

- 🐍 **Python 3.10+**
- 🟢 **Node.js 18+**
- 📦 **npm**
- 🐘 **PostgreSQL**
- 🤖 **LLM API key** for AI-powered bug analysis

## 1️⃣ 📥 Clone the Repository

Clone the FixLens repository and move into the project directory.

```bash
git clone https://github.com/maalideekshith/Fixlens.git
cd Fixlens
```

## 2️⃣ ⚙️ Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

### Windows

```bash
venv\Scripts\activate
```

### macOS/Linux

```bash
source venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` directory:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_ALGORITHM=HS256
LLM_API_KEY=your_llm_api_key
LLM_MODEL=your_llm_model
```

Start the FastAPI backend:

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

- 🌐 **API:** http://localhost:8000
- 📚 **API Documentation:** http://localhost:8000/docs

## 3️⃣ 🎨 Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd Fixlens/frontend
```

Install the frontend dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at:

- 💻 **Application:** http://localhost:5173

## 🔒 Environment Variables

For security, never commit `.env` files or expose sensitive credentials.

The following values should remain private:

- 🔑 PostgreSQL connection string
- 🔐 JWT secret
- 🤖 LLM API key
- ⚙️ Production environment variables

> 💡 **Note:** Run the backend and frontend in separate terminals. The backend must be running for the frontend to communicate with the API.
## 🗺️ Roadmap

- 🤖 **AI-Powered Bug Analysis** — Analyze reported bugs and provide useful debugging insights.
- 📊 **Bug Dashboard & Tracking** — Track reported issues with organized bug history and statistics.
- 📸 **Screenshot Support** — Attach screenshots to bug reports for better issue understanding.
- 🔐 **Secure Authentication** — JWT-based authentication with protected user-specific data.
- ⚙️ **REST API** — FastAPI backend with structured endpoints for authentication and bug management.
- 🗄️ **PostgreSQL Integration** — Securely store users and bug reports in a relational database.
- ☁️ **Production Deployment** — Deployed frontend and backend using Vercel and Render.
- 🔗 **GitHub Integration** — Planned integration for connecting FixLens with GitHub issue workflows.
- 💡 **AI Fix Suggestions** — Planned improvements to provide more actionable solutions for reported bugs.
- 📈 **Advanced Analytics** — Planned analytics for deeper insights into bug trends and project health.

> 🚀 **FixLens is continuously evolving toward a smarter and more efficient bug management experience for developers.**

## 👨‍💻 Author

Built and maintained with ❤️ by **Maali Deekshith**

🎓 Computer Science Engineering Student

🔗 **GitHub:** [@maalideekshith](https://github.com/maalideekshith)

> 🚀 FixLens is an independent project built to explore AI-powered developer tools and make software bug analysis faster and more effective.