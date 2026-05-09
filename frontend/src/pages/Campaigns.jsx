import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Campaigns.css";
import api from "./api";

export default function Campaigns() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {

      const res = await api.get("/api/logs");

      setCampaigns(res.data);

    } catch (err) {
      console.log("Campaign Error:", err);
    }
  };

  return (
    <div className="campaign-page-container bg-cyber bg-grid">
      <div className="campaign-header">

  <div className="campaign-header-content">

    <h1>Campaigns</h1>

    <p>
      Manage and track all messaging campaigns
    </p>

  </div>

  <div className="campaign-action">

    <button
      className="new-btn"
      onClick={() => navigate("/sendmessage")}
    >
      + New Campaign
    </button>

  </div>

</div>

      <div className="campaign-grid">

        {campaigns.length > 0 ? (
          campaigns.map((item, index) => (
            <div className="campaign-card" key={index}>

              <div className="top-section">

                <span className={`status ${item.status?.toLowerCase()}`}>
                  {item.status}
                </span>

                <span className="channel">
                  {item.channel}
                </span>

              </div>

              <h2>
                {item.title || "Untitled Campaign"}
              </h2>

              <p className="message">
                {item.message}
              </p>

              <div className="campaign-info">

                <div>
                  <h4>Recipients</h4>
                  <p>
                    {item.recipients?.length || 0}
                  </p>
                </div>

                <div>
                  <h4>Date</h4>
                  <p>
                    {item.timestamp}
                  </p>
                </div>

              </div>

            </div>
          ))
        ) : (
          <div className="empty-box">
            No Campaigns Found
          </div>
        )}

      </div>

    </div>
  );
}