from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.ai_service import analyze_bug
from app.db.database import Base, engine, get_db
from app.db import models
from app.routers.auth import router as auth_router
from app.routers.bugs import router as bugs_router
from app.core.security import get_current_user
from app.db.models import Bug, User
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="FixLens API",
    description="AI-powered bug reporting platform",
    version="1.0.0",
)
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://fixlens-one.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(bugs_router)


@app.get("/")
def root():
    return {
        "message": "FixLens API is running"
    }


@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected",
        }

    except Exception as error:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(error),
        }


@app.get("/ai/test")
async def test_ai():
    result = await analyze_bug(
        title="Login button not working",
        description="The login button does nothing after valid credentials are entered.",
        expected_behavior="User should be logged in.",
        actual_behavior="Nothing happens after clicking Login.",
        steps_to_reproduce=(
            "Open login page, enter valid credentials, click Login."
        ),
    )

    return {
        "analysis": result
    }


@app.post("/bugs/{bug_id}/analyze")
async def analyze_existing_bug(
    bug_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Find the bug belonging to the logged-in user
    bug = (
        db.query(Bug)
        .filter(
            Bug.id == bug_id,
            Bug.user_id == current_user.id,
        )
        .first()
    )

    if not bug:
        raise HTTPException(
            status_code=404,
            detail="Bug not found",
        )

    # Send bug information to AI
    result = await analyze_bug(
        title=bug.title,
        description=bug.description,
        expected_behavior=bug.expected_behavior,
        actual_behavior=bug.actual_behavior,
        steps_to_reproduce=bug.steps_to_reproduce,
    )

    return {
        "bug_id": bug.id,
        "analysis": result,
    }