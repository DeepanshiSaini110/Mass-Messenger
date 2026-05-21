import React, { useEffect, useState } from "react";
import "../styles/Reports.css";
import api from "./api";
import "../styles/theme.css";

export default function Reports() {

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {

      const res = await api.get("/api/logs");

      setLogs(res.data);

    } catch (err) {
      console.log("Reports Error:", err);
    }
  };

  const exportExcel = () => {
  window.open(
    `${process.env.REACT_APP_API_URL}/api/logs/export/excel`,
    "_blank"
  );
};

  const totalMessages = logs.length;

  const emailCount = logs.filter(
    (item) => item.channel === "email"
  ).length;

  const whatsappCount = logs.filter(
    (item) => item.channel === "whatsapp"
  ).length;

  const smsCount = logs.filter(
    (item) => item.channel === "sms"
  ).length;

  return (
    <div className="reports-page bg-cyber bg-grid">

      <div className="reports-header">

        <div>
          <h1>Reports</h1>
          <p>Detailed messaging and delivery reports</p>
        </div>

        <button
          className="export-btn"
          onClick={exportExcel}
        >
          Export Excel
        </button>

      </div>

      {/* REPORT CARDS */}

      <div className="report-grid">

        <div className="report-card">
          <h2>{totalMessages}</h2>
          <p>Total Campaigns</p>
        </div>

        <div className="report-card">
          <h2>{emailCount}</h2>
          <p>Email Reports</p>
        </div>

        <div className="report-card">
          <h2>{whatsappCount}</h2>
          <p>WhatsApp Reports</p>
        </div>

        <div className="report-card">
          <h2>{smsCount}</h2>
          <p>SMS Reports</p>
        </div>

      </div>

      {/* TABLE */}

      <div className="reports-table">

        <table>

          <thead>
            <tr>
              <th>Date</th>
              <th>Channel</th>
              <th>Recipients</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {logs.length > 0 ? (
              logs.map((item, index) => (
                <tr key={index}>

                  <td>{item.timestamp}</td>

                  <td className="channel">
                    {item.channel}
                  </td>

                  <td>
                    {item.recipients?.length || 0}
                  </td>

                  <td className="message">
                    {item.message}
                  </td>

                  <td>
                    <span className="status">
                      {item.status}
                    </span>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="empty"
                >
                  No Reports Found
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}