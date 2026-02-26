import React, { useEffect, useState } from "react";
import "../styles/theme.css";
import "../styles/Logs.css";
import api from "./api";

const ITEMS_PER_PAGE = 5;

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await api.get("/api/logs");
        setLogs(res.data);
      } catch (err) {
        console.error("LOAD LOGS ERROR:", err);
      }
    };
    loadLogs();
  }, []);


  const filteredLogs = logs.filter((log) =>
    log.message.toLowerCase().includes(search.toLowerCase())
  );

  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedLogs = filteredLogs.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

  return (
    <div className="logs-container bg-cyber bg-grid">
      <div className="logs-wrapper">
        <div className="header">
          <h1 className="page-title">Message Logs</h1>
          <p className="page-subtitle">View Delivery History</p>
        </div>

        <div className="filters">
          <input
            className="filter-input"
            placeholder="Search message..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Recipients</th>
                <th>Channel</th>
                <th>Message</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty">
                    No Logs Found
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log._id}>
                    <td className="timestamp">{log.timestamp}</td>
                    <td>{log.recipients.length} recipient(s)</td>
                    <td className="channel">{log.channel.toUpperCase()}</td>
                    <td className="message">{log.message}</td>
                    <td className="status delivered">● Delivered</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={page === i + 1 ? "active" : ""}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}