import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";
import "./History.css";

const History = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/history/", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => setEntries(res.data))
      .catch((err) => console.error("Failed to fetch history", err));
  }, []);

  return (
    <div className="history-page">
      <h2 className="history-title">📅 My Emotion History</h2>

      {entries.length === 0 ? (
        <p className="no-entries">No entries yet.</p>
      ) : (
        <div className="history-list">
          {entries.map((entry, i) => (
            <div className="history-card fade-in" key={i}>
              <div className="history-meta">
                <span className="timestamp">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
                <span className="emotion">{entry.emotion}</span>
                <span className="sentiment-tag">
                  Sentiment: <b>{entry.sentiment}</b>
                </span>
              </div>

              <div className="suggestions">
                <h4>💡 Suggestions:</h4>
                <ul>
                  {entry.suggestions.map((sug, j) => (
                    <li key={j}>✅ {sug}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
