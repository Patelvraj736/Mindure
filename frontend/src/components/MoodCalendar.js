import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import axios from "axios";

const emotionEmojis = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  neutral: "😐",
  surprised: "😲",
  fear: "😨",
  disgust: "🤢",
};

const MoodCalendar = () => {
  const [moodData, setMoodData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dominantEmotion, setDominantEmotion] = useState(null);
  const [predictedEmotion, setPredictedEmotion] = useState(null);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/calendar/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const moodMap = res.data.reduce((acc, item) => {
          acc[item.date] = item.emotion;
          return acc;
        }, {});
        setMoodData(moodMap);

        const freqMap = {};
        for (const emotion of Object.values(moodMap)) {
          freqMap[emotion] = (freqMap[emotion] || 0) + 1;
        }

        const sorted = Object.entries(freqMap).sort((a, b) => b[1] - a[1]);
        if (sorted[0]) setDominantEmotion(sorted[0][0]);

        const recentDates = Object.keys(moodMap).sort().reverse();
        const recentMoods = recentDates.map((date) => moodMap[date]);
        if (recentMoods.length >= 1) {
          const prediction = recentMoods[0];
          setPredictedEmotion(prediction);
        }
      } catch (err) {
        console.error("Failed to fetch calendar data", err);
      }
    };

    fetchCalendarData();
  }, []);

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const key = date.toLocaleDateString("en-CA");
    if (moodData[key]) {
      const emotion = moodData[key];
      return (
        <div className="emoji-bubble bounce">
          {emotionEmojis[emotion] || "❓"}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="calendar-page">
      <div className="calendar-header fade-in">
        <h1>Mood Calendar 🗓️</h1>
        <p>Track how you've been feeling each day</p>
      </div>

      <div className="calendar-insights">
        {predictedEmotion && (
          <div className="calendar-card prediction-card">
            <h3>🔮 Mood Prediction</h3>
            <p>
              You might feel <strong>{emotionEmojis[predictedEmotion]} {predictedEmotion}</strong> next.
            </p>
          </div>
        )}

        {dominantEmotion && (
          <div className="calendar-card insight-card">
            <h3>🧠 Dominant Emotion</h3>
            <p>
              Mostly felt <strong>{emotionEmojis[dominantEmotion]} {dominantEmotion}</strong>
            </p>
          </div>
        )}
      </div>

      <div className="calendar-container slide-up">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={tileContent}
          className="custom-calendar"
        />
      </div>
    </div>
  );
};

export default MoodCalendar;
