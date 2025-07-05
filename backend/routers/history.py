from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import EmotionEntry, User
from schemas import EmotionEntryOut
from auth import get_db, get_current_user
from datetime import timezone as dt_timezone
from pytz import timezone
import json

router = APIRouter()
IST = timezone("Asia/Kolkata")

@router.get("/history/", response_model=list[EmotionEntryOut])
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entries = db.query(EmotionEntry).filter(
        EmotionEntry.user_id == current_user.id
    ).order_by(EmotionEntry.timestamp.desc()).all()

    for entry in entries:
        if entry.timestamp.tzinfo is None:
            entry.timestamp = entry.timestamp.replace(tzinfo=dt_timezone.utc).astimezone(IST)
        else:
            entry.timestamp = entry.timestamp.astimezone(IST)
        entry.suggestions = json.loads(entry.suggestions)

    return entries
