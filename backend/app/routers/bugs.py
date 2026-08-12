from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.db.models import Bug, User
from app.schemas.bug import BugCreate, BugResponse, BugUpdate
from app.services.ai_service import analyze_bug


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


router = APIRouter(
    prefix="/bugs",
    tags=["Bugs"],
)


# ---------------------------------------------------------
# CREATE BUG
# ---------------------------------------------------------

@router.post(
    "",
    response_model=BugResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_bug(
    data: BugCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bug = Bug(
        user_id=current_user.id,
        title=data.title,
        description=data.description,
        severity=data.severity,
        category=data.category,
        expected_behavior=data.expected_behavior,
        actual_behavior=data.actual_behavior,
        steps_to_reproduce=data.steps_to_reproduce,
    )

    db.add(bug)
    db.commit()
    db.refresh(bug)

    return bug


# ---------------------------------------------------------
# GET ALL BUGS
# ---------------------------------------------------------

@router.get(
    "",
    response_model=list[BugResponse],
)
def get_bugs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bugs = (
        db.query(Bug)
        .filter(Bug.user_id == current_user.id)
        .order_by(Bug.created_at.desc())
        .all()
    )

    return bugs


# ---------------------------------------------------------
# GET SINGLE BUG
# ---------------------------------------------------------

@router.get(
    "/{bug_id}",
    response_model=BugResponse,
)
def get_bug(
    bug_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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

    return bug


# ---------------------------------------------------------
# UPDATE BUG
# ---------------------------------------------------------

@router.patch(
    "/{bug_id}",
    response_model=BugResponse,
)
def update_bug(
    bug_id: int,
    data: BugUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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

    update_data = data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(bug, field, value)

    db.commit()
    db.refresh(bug)

    return bug


# ---------------------------------------------------------
# DELETE BUG
# ---------------------------------------------------------

@router.delete(
    "/{bug_id}",
)
def delete_bug(
    bug_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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

    db.delete(bug)
    db.commit()

    return {
        "message": "Bug deleted successfully"
    }


# ---------------------------------------------------------
# UPLOAD SCREENSHOT
# ---------------------------------------------------------

@router.post(
    "/{bug_id}/screenshot",
    response_model=BugResponse,
)
async def upload_screenshot(
    bug_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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

    allowed_types = {
        "image/png",
        "image/jpeg",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only PNG, JPEG, and WebP images are allowed",
        )

    extension = Path(file.filename).suffix.lower()

    filename = f"bug_{bug_id}{extension}"

    file_path = UPLOAD_DIR / filename

    contents = await file.read()

    file_path.write_bytes(contents)

    bug.screenshot_url = f"/uploads/{filename}"

    db.commit()
    db.refresh(bug)

    return bug
@router.post(
    "/{bug_id}/analyze",
    response_model=BugResponse,
)
async def analyze_existing_bug(
    bug_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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

    # -------------------------------------------------
    # MARK ANALYSIS AS IN PROGRESS
    # -------------------------------------------------

    bug.analysis_status = "analyzing"

    db.commit()
    db.refresh(bug)

    try:
        # -------------------------------------------------
        # RUN AI ANALYSIS
        # -------------------------------------------------

        analysis = await analyze_bug(
            title=bug.title,
            description=bug.description,
            expected_behavior=bug.expected_behavior,
            actual_behavior=bug.actual_behavior,
            steps_to_reproduce=bug.steps_to_reproduce,
            screenshot_url=bug.screenshot_url,
        )

        # -------------------------------------------------
        # SAVE AI RESULTS
        # -------------------------------------------------

        bug.ai_summary = analysis.get("summary")

        bug.ai_visual_evidence = analysis.get(
            "visual_evidence"
        )

        bug.ai_root_cause = analysis.get(
            "probable_cause"
        )

        bug.ai_suggested_fix = analysis.get(
            "suggested_fix"
        )

        bug.ai_severity = analysis.get(
            "severity"
        )

        bug.ai_priority = analysis.get(
            "priority"
        )

        bug.ai_confidence = analysis.get(
            "confidence"
        )

        # -------------------------------------------------
        # MARK ANALYSIS AS COMPLETED
        # -------------------------------------------------

        bug.analysis_status = "completed"

        db.commit()
        db.refresh(bug)

        return bug

    except Exception as error:

        # -------------------------------------------------
        # MARK ANALYSIS AS FAILED
        # -------------------------------------------------

        bug.analysis_status = "failed"

        db.commit()

        print(
            f"AI analysis failed for bug "
            f"{bug_id}: {error}"
        )

        raise HTTPException(
            status_code=500,
            detail="AI bug analysis failed",
        )