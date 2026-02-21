import React from 'react'; // Import React
import "../styles/theme.css";
import "../styles/Dashboard.css"
import { useEffect } from 'react';
import api from "./api";

export default function Dashboard(){
  useEffect(() => {

  const loadStats = async () => {
    try {
      const res = await api.get("/api/dashboard-stats");

      animateCounter("messageSent", res.data.messagesSent);
      animateCounter("deliveryRate", res.data.deliveryRate);
      animateCounter("activeRecipients", res.data.activeRecipients);
      animateCounter("openRate", res.data.openRate);

    } catch (err) {
      console.log("DASHBOARD ERROR:", err);
    }
  };

  loadStats();

}, []);
  return(
    <div className="dashboard-container bg-cyber bg-grid">
      <div className="dashboard-wrapper">
        <header className="header">
          <h1 className='dashboard-title'>Dashboard</h1>
          <p className="dashboard-subtitle">Compaign Management & Analytics</p>
        </header>
        <div className="primary-metrics">
          <Metric icon="📤" label="Message Sent" valueId="messageSent" subtitle="Today's Total" trend="↑ 8.5% from yesterday"/>

          <Metric icon="✅" label="Delivery Rate" valueId="deliveryRate" subtitle="Success Rate" trend="↑ 2.1% improvement"/>

          <Metric icon="👥" label="Active Recipients" valueId="activeRecipients" subtitle="Subscribed Users" trend="↑ 12.3% growth"/>

          <Metric icon="📊" label="Open Rate" valueId="openRate" subtitle="Average Engagement" trend="↑ 4.2% Higher"/>
        </div>
      </div>
    </div>
  );
}
function Metric({icon,label,valueId,subtitle,trend}){
  return(
    <div className="metric-card">
      <div>
        <span className="metric-icon">{icon}</span>
        <p className="metric-label">{label}</p>
        <p className="metric-value" id={valueId}>0</p>
        <p className="metric-subtitle" id={subtitle}>0</p>
        </div>
        <p className="metric-trend" id={trend}>0</p>
      
    </div>
  );
}
function animateCounter(id,target){
  const el=document.getElementById(id);
  if(!el)return;
  const duration=2000;
  const startTime=performance.now();
  function update(time){
    const progress=Math.min((time-startTime)/duration,1);
    if(typeof target==="string"){
      const num=parseFloat(target)*progress;
      el.textContent=target.includes("%")
      ?num.toFixed(1)+"%"
      :num.toFixed(1)+"K";
    }else{
      el.textContent=Math.floor(target*progress).toLocaleString();
    }
    if (progress<1){
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}