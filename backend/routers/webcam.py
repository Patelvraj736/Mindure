from fastapi import APIRouter, UploadFile, File
from emotion_model import analyze_emotion

router = APIRouter()

@router.post("/detect-emotion/")
async def detect_emotion(image: UploadFile = File(...)):
    contents = await image.read()
    emotion_result = analyze_emotion(contents)
    return {
        "emotion": emotion_result["dominant"],
        "emotions": emotion_result["all_emotions"]
    }
