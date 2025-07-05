from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from auth import get_db
from models import EmotionLog, JournalEntry

router = APIRouter()

@router.get("/dashboard/")
def get_dashboard_data(db: Session = Depends(get_db)):
    emotion_reports = db.query(EmotionLog).count()
    

    journal_entries = db.query(JournalEntry).filter(JournalEntry.content != None, JournalEntry.content != "").count()

    suggestions_used = db.query(EmotionLog).filter(EmotionLog.suggestions != None).count()

    emotion_counts = (
        db.query(EmotionLog.emotion, func.count(EmotionLog.id))
        .group_by(EmotionLog.emotion)
        .all()
    )

    mood_trend = [
        {"label": emotion, "value": count}
        for emotion, count in emotion_counts
    ]

    return {
        "emotion_reports": emotion_reports,
        "journal_entries": journal_entries,
        "suggestions_used": suggestions_used,
        "mood_trend": mood_trend
    }
