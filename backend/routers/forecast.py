from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from auth import get_current_user, get_db
from models import EmotionLog
from collections import Counter
import datetime

router = APIRouter()

@router.get("/forecast/")
def forecast_mood(db: Session = Depends(get_db), user=Depends(get_current_user)):
    logs = db.query(EmotionLog).filter(EmotionLog.user_id == user.id).order_by(EmotionLog.date).all()
    if len(logs) < 3:
        return {"forecast": "neutral"}  # fallback

    # Convert to list of emotions
    emotion_sequence = [log.emotion for log in logs]

    # Simple Markov-like forecast: take most common transition from last emotion
    transitions = {}
    for i in range(len(emotion_sequence) - 1):
        curr, next_ = emotion_sequence[i], emotion_sequence[i+1]
        if curr not in transitions:
            transitions[curr] = []
        transitions[curr].append(next_)

    last_emotion = emotion_sequence[-1]
    next_possible = transitions.get(last_emotion, [])

    if not next_possible:
        forecast = Counter(emotion_sequence).most_common(1)[0][0]
    else:
        forecast = Counter(next_possible).most_common(1)[0][0]

    return {"forecast": forecast}
