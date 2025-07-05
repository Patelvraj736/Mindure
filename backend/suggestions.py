def get_suggestions(emotion, sentiment):
    combined = f"{emotion}_{sentiment}"
    
    rules = {
        "happy_positive": ["Celebrate small wins!", "Keep up the good mood."],
        "sad_negative": ["Take a short walk.", "Talk to someone you trust."],
        "angry_negative": ["Try breathing exercises.", "Write down your thoughts."],
        "fear_negative": ["Listen to calming music.", "Try journaling again later."],
        "neutral_neutral": ["Do something creative.", "Take a break from screens."],
        "surprise_positive": ["Reflect on what surprised you.", "Keep being curious!"],
        "happy_neutral": ["Gratitude journaling can help.", "Share your joy with others."],
    }

    default = ["Take care of yourself today.", "Remember it’s okay to ask for help."]
    return rules.get(combined, default)
