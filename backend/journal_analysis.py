from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()

def analyze_sentiment(text):
    if not text.strip():
        return "neutral"

    scores = analyzer.polarity_scores(text)
    compound = scores["compound"]

    if compound >= 0.3:
        return "positive"
    elif compound <= -0.3:
        return "negative"
    else:
        return "neutral"
