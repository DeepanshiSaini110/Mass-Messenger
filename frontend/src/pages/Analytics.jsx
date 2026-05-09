import React, { useEffect, useState } from "react";
import "../styles/Analytics.css";
import api from "./api";
import "../styles/theme.css";

export default function Analytics() {

  const [stats, setStats] = useState({
    totalMessages: 0,
    totalRecipients: 0,
    emailCount: 0,
    whatsappCount: 0,
    smsCount: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {

      const logsRes = await api.get("/api/logs");

      const recipientsRes = await api.get("/api/recipients");

      const logs = logsRes.data;

      const recipients = recipientsRes.data;

      const emailCount = logs.filter(
        (item) => item.channel === "email"
      ).length;

      const whatsappCount = logs.filter(
        (item) => item.channel === "whatsapp"
      ).length;

      const smsCount = logs.filter(
        (item) => item.channel === "sms"
      ).length;

      setStats({
        totalMessages: logs.length,
        totalRecipients: recipients.length,
        emailCount,
        whatsappCount,
        smsCount,
      });

    } catch (err) {
      console.log("Analytics Error:", err);
    }
  };

  return (
    <div className="analytics-page bg-cyber bg-grid">

      <div className="analytics-header">

        <div>
          <h1>Analytics</h1>
          <p>Real-time messaging insights and statistics</p>
        </div>

      </div>

      {/* TOP CARDS */}

      <div className="stats-grid">

        <div className="stat-card">
          <h2>{stats.totalMessages}</h2>
          <p>Total Messages</p>
        </div>

        <div className="stat-card">
          <h2>{stats.totalRecipients}</h2>
          <p>Total Recipients</p>
        </div>

        <div className="stat-card">
          <h2>{stats.emailCount}</h2>
          <p>Email Campaigns</p>
        </div>

        <div className="stat-card">
          <h2>{stats.whatsappCount}</h2>
          <p>WhatsApp Campaigns</p>
        </div>

      </div>

      {/* CHANNEL ANALYTICS */}

      <div className="channel-section">

        <div className="channel-card">

          <div className="channel-top">
            <h3>Email</h3>
            <span>{stats.emailCount}</span>
          </div>

          <div className="progress">
            <div
              className="progress-fill email"
              style={{
                width: `${stats.totalMessages
                  ? (stats.emailCount / stats.totalMessages) * 100
                  : 0
                }%`,
              }}
            ></div>
          </div>

        </div>

        <div className="channel-card">

          <div className="channel-top">
            <h3>WhatsApp</h3>
            <span>{stats.whatsappCount}</span>
          </div>

          <div className="progress">
            <div
              className="progress-fill whatsapp"
              style={{
                width: `${stats.totalMessages
                  ? (stats.whatsappCount / stats.totalMessages) * 100
                  : 0
                }%`,
              }}
            ></div>
          </div>

        </div>

        <div className="channel-card">

          <div className="channel-top">
            <h3>SMS</h3>
            <span>{stats.smsCount}</span>
          </div>

          <div className="progress">
            <div
              className="progress-fill sms"
              style={{
                width: `${stats.totalMessages
                  ? (stats.smsCount / stats.totalMessages) * 100
                  : 0
                }%`,
              }}
            ></div>
          </div>

        </div>

      </div>

      {/* SUMMARY */}

      <div className="summary-card">

        <h2>Performance Summary</h2>

        <p>
          Your messaging platform has successfully managed{" "}
          <strong>{stats.totalMessages}</strong> campaigns
          across multiple channels with{" "}
          <strong>{stats.totalRecipients}</strong> active recipients.
        </p>

      </div>

    </div>
  );
}