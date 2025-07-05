from fastapi import APIRouter, UploadFile, Form, Depends
from sqlalchemy.orm import Session
from models import EmotionEntry, EmotionLog, JournalEntry, User
from emotion_model import analyze_emotion
from journal_analysis import analyze_sentiment
from suggestions import get_suggestions
from auth import get_db, get_current_user
from datetime import date
import json

router = APIRouter()

@router.post("/analyze/")
async def analyze(
    image: UploadFile,
    journal: str = Form(""),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contents = await image.read()
    emotion_result = analyze_emotion(contents)
    sentiment = analyze_sentiment(journal)
    suggestions = get_suggestions(emotion_result["dominant"], sentiment)

    entry = EmotionEntry(
        emotion=emotion_result["dominant"],
        sentiment=sentiment,
        suggestions=json.dumps(suggestions),
        user_id=current_user.id
    )
    db.add(entry)

    log = EmotionLog(
        user_id=current_user.id,
        emotion=emotion_result["dominant"],
        suggestions=suggestions,
        date=date.today()
    )
    db.add(log)

    if journal.strip():
        journal_entry = JournalEntry(
            user_id=current_user.id,
            content=journal.strip(),
            date=date.today()
        )
        db.add(journal_entry)

    db.commit()

    return {
        "emotion": emotion_result["dominant"],
        "emotions": emotion_result["all_emotions"],
        "sentiment": sentiment,
        "suggestions": suggestions
    }
