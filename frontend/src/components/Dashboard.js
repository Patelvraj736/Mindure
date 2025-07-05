import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState({
    emotion_reports: 0,
    journal_entries: 0,
    suggestions_used: 0,
    mood_trend: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/dashboard/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: data.mood_trend.map((item) => item.label),
    datasets: [
      {
        label: "Number of People",
        data: data.mood_trend.map((item) => item.value),
        backgroundColor: [
          "#6C63FF", "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
        ],
        borderRadius: 5,
        barThickness: 40,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const emotion = data.mood_trend[context.dataIndex].label;
            const value = context.parsed.y;
            return `Emotion: ${emotion} | People: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: "People",
        },
      },
      x: {
        title: {
          display: true,
          text: "Emotion",
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome Back 👋</h2>

      <div className="card-grid">
        <div className="card">
          <h3>Emotion Reports</h3>
          <p>{data.emotion_reports}</p>
        </div>
        <div className="card">
          <h3>Journal Entries</h3>
          <p>{data.journal_entries}</p>
        </div>
        <div className="card">
          <h3>Suggestions Used</h3>
          <p>{data.suggestions_used}</p>
        </div>
      </div>

      <div className="chart-container" style={{ height: "300px" }}>
        <h3>Emotion Distribution</h3>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Dashboard;
