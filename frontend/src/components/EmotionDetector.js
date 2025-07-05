import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import "./EmotionDetector.css";
import { getToken } from "../utils/auth";
import axios from "axios";

const EmotionDetector = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [journal, setJournal] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveEmotion, setLiveEmotion] = useState(null);
  const [confirmedEmotion, setConfirmedEmotion] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
    };
    loadModels();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video.readyState === 4 &&
        faceapi.nets.tinyFaceDetector.params
      ) {
        const video = webcamRef.current.video;

        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        const canvas = canvasRef.current;
        faceapi.matchDimensions(canvas, {
          width: video.videoWidth,
          height: video.videoHeight,
        });

        const resized = faceapi.resizeResults(detections, {
          width: video.videoWidth,
          height: video.videoHeight,
        });

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (resized.length > 0) {
          const expressions = resized[0].expressions;
          const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
          const topEmotion = sorted[0][0];
          setLiveEmotion(topEmotion);

          const box = resized[0].detection.box;
          ctx.strokeStyle = "#00FF00";
          ctx.lineWidth = 2;
          ctx.strokeRect(box.x, box.y, box.width, box.height);

          ctx.fillStyle = "#00FF00";
          ctx.font = "22px Arial";
          ctx.fillText(topEmotion, box.x, box.y - 8);
        } else {
          setLiveEmotion(null);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const captureAndAnalyze = async () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return alert("Webcam not ready or face not detected.");
    const blob = await (await fetch(screenshot)).blob();
    const formData = new FormData();
    formData.append("image", blob, "capture.jpg");
    formData.append("journal", journal);

    try {
      setLoading(true);
      setConfirmedEmotion(liveEmotion);
      const token = getToken();
      const res = await axios.post("http://localhost:8000/analyze/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResult(res.data);
    } catch (err) {
      alert("Failed to analyze");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emotion-page">
      <div className="analyzer-card">
        <h1>🎭 Emotion & Journal Analyzer</h1>

       
        <div className="camera-container">
          <Webcam
            ref={webcamRef}
            className="webcam"
            screenshotFormat="image/jpeg"
          />
          <canvas ref={canvasRef} className="webcam-canvas" />
        </div>

        <textarea
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          className="journal-textarea"
          placeholder="How do you feel today?"
        />

        <button
          className="analyze-button"
          onClick={captureAndAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Emotion & Journal"}
        </button>
      </div>

      {result && (
        <div className="results-container fade-in">
          <div className="result-card">
            <h3>🧠 Detected Emotion</h3>
            <p className="highlight">{confirmedEmotion || "Not Detected"}</p>
          </div>

          <div className="result-card">
            <h3>📝 Journal Sentiment</h3>
            <p className="highlight">{result.sentiment}</p>
          </div>

          <div className="result-card">
            <h4>📊 Emotion Confidence Scores</h4>
            <ul>
              {Object.entries(result.emotions).map(([emotion, score], i) => (
                <li key={i}>
                  {emotion.charAt(0).toUpperCase() + emotion.slice(1)}:{" "}
                  {score.toFixed(2)}%
                </li>
              ))}
            </ul>
          </div>

          <div className="result-card suggestion-card">
            <h4>💡 Personalized Suggestions</h4>
            <ul>
              {result.suggestions.map((suggestion, index) => (
                <li key={index}>✅ {suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionDetector;
