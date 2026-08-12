from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(100),
        nullable=False,
    )

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash = Column(
        String(255),
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    bugs = relationship(
        "Bug",
        back_populates="user",
        cascade="all, delete-orphan",
    )


class Bug(Base):
    __tablename__ = "bugs"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    title = Column(
        String(255),
        nullable=False,
    )

    description = Column(
        String,
        nullable=False,
    )

    severity = Column(
        String(50),
        nullable=True,
    )

    category = Column(
        String(100),
        nullable=True,
    )

    expected_behavior = Column(
        String,
        nullable=True,
    )

    actual_behavior = Column(
        String,
        nullable=True,
    )

    steps_to_reproduce = Column(
        String,
        nullable=True,
    )

    status = Column(
        String(50),
        default="open",
        nullable=False,
    )

    screenshot_url = Column(
        String,
        nullable=True,
    )

    # -------------------------------------------------
    # AI ANALYSIS
    # -------------------------------------------------
    analysis_status = Column(
    String(30),
    default="not_analyzed",
    nullable=False,
)
    ai_summary = Column(
        String,
        nullable=True,
    )

    ai_visual_evidence = Column(
        String,
        nullable=True,
    )

    ai_root_cause = Column(
        String,
        nullable=True,
    )

    ai_suggested_fix = Column(
        String,
        nullable=True,
    )

    ai_severity = Column(
        String(50),
        nullable=True,
    )

    ai_priority = Column(
        String(50),
        nullable=True,
    )

    ai_confidence = Column(
        Integer,
        nullable=True,
    )

    # -------------------------------------------------
    # TIMESTAMPS
    # -------------------------------------------------

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    # -------------------------------------------------
    # RELATIONSHIP
    # -------------------------------------------------

    user = relationship(
        "User",
        back_populates="bugs",
    )