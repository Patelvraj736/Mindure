from deepface import DeepFace
from io import BytesIO
from PIL import Image
import numpy as np

def analyze_emotion(image_bytes):
    img = Image.open(BytesIO(image_bytes))
    img_np = np.array(img)
    result = DeepFace.analyze(img_np, actions=['emotion'], enforce_detection=False)

    emotions_raw = result[0]["emotion"]
    emotions_clean = {k: float(v) for k, v in emotions_raw.items()} 

    return {
        "dominant": result[0]["dominant_emotion"],
        "all_emotions": emotions_clean
    }
