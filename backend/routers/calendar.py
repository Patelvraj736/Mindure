from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from auth import get_current_user, get_db
from models import EmotionLog
from datetime import datetime
from collections import defaultdict

router = APIRouter()

@router.get("/calendar/")
def get_calendar_data(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    logs = db.query(EmotionLog).filter(
        EmotionLog.user_id == current_user.id
    ).order_by(EmotionLog.date.desc(), EmotionLog.id.desc()).all()

    latest_per_day = {}
    for log in logs:
        date_str = log.date.strftime("%Y-%m-%d")
        if date_str not in latest_per_day:
            latest_per_day[date_str] = log.emotion

    return [{"date": date, "emotion": emotion} for date, emotion in latest_per_day.items()]
