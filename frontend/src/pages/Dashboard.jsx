import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "./api";

import {
  Search,
  Bell,
  Settings,
  BarChart3,
  Users,
  Mail,
  Rocket,
  LayoutDashboard,
  PieChart,
} from "lucide-react";

import "../styles/Dashboard.css";

export default function Dashboard() {

  const navigate = useNavigate();

  /* ================= STATES ================= */

  const [searchTerm, setSearchTerm] =
    useState("");

  const [notifications, setNotifications] =
    useState([]);

  const [showNotifications,
    setShowNotifications] =
    useState(false);

  /* ================= LOAD STATS ================= */

  useEffect(() => {

    loadStats();

  }, []);

  const loadStats = async () => {

    try {

      const res =
        await api.get(
          "/api/dashboard-stats"
        );

      animateCounter(
        "emailsSent",
        res.data.messagesSent
      );

      animateCounter(
        "openRate",
        res.data.openRate
      );

      animateCounter(
        "clickRate",
        res.data.deliveryRate
      );

      animateCounter(
        "revenue",
        res.data.activeRecipients
      );

    } catch (err) {

      console.log(err);

    }

  };

  /* ================= SOCKET ================= */

  useEffect(() => {

    const socket = io(
 process.env.REACT_APP_API_URL
);

    socket.on("connect", () => {  

      console.log(
        "✅ Socket Connected"
      );

    });

    socket.on(
      "new_notification",
      (data) => {

        console.log(
          "🔥 Notification:",
          data
        );

        setNotifications(prev => [
          data,
          ...prev
        ]);

      }
    );

    socket.on(
      "connect_error",
      (err) => {

        console.log(
          "❌ Socket Error:",
          err
        );

      }
    );

    return () => {

      socket.disconnect();

    };

  }, []);

  /* ================= SEARCH ================= */

  const handleSearch = (e) => {

    const value = e.target.value;

    setSearchTerm(value);

    const search =
      value.toLowerCase();

    if (
      search.includes("campaign")
    ) {

      navigate("/campaigns");

    }

    else if (
      search.includes("audience")
    ) {

      navigate("/audience");

    }

    else if (
      search.includes("analytic")
    ) {

      navigate("/analytics");

    }

    else if (
      search.includes("report")
    ) {

      navigate("/reports");

    }

    else if (
      search.includes("setting")
    ) {

      navigate("/settings");

    }

  };

  return (

    <div className="dashboard bg-cyber bg-grid">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo">

          <Rocket size={40} />

          <h2>BULK SENDER</h2>

        </div>

        <nav className="sidebar-menu">

          <Link
            to="/dashboard"
            className="menu-item active"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            to="/campaigns"
            className="menu-item"
          >
            <Mail size={18} />
            Campaigns
          </Link>

          <Link
            to="/audience"
            className="menu-item"
          >
            <Users size={18} />
            Audience
          </Link>

          <Link
            to="/analytics"
            className="menu-item"
          >
            <BarChart3 size={18} />
            Analytics
          </Link>

          <Link
            to="/reports"
            className="menu-item"
          >
            <PieChart size={18} />
            Reports
          </Link>

          <Link
            to="/settings"
            className="menu-item"
          >
            <Settings size={18} />
            Settings
          </Link>

        </nav>

        <div className="profile-card">

          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="profile-img"
          />

          <div>

            <h4>Alex Morgan</h4>

            <p>Pro Plan</p>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <main className="main-content">

        {/* TOPBAR */}

        <div className="topbar">

          <h1>Overview</h1>

          <div className="topbar-right">

            {/* SEARCH */}

            <div className="search-box">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search pages..."
                value={searchTerm}
                onChange={handleSearch}
              />

            </div>

            {/* NOTIFICATION */}

            <div className="notification-wrapper">

              <div
                className="bell-box"
                onClick={() =>
                  setShowNotifications(
                    !showNotifications
                  )
                }
              >

                <Bell size={20} />

                {notifications.length > 0 && (
                  <span className="notification-dot"></span>
                )}

              </div>

              {showNotifications && (

                <div className="notification-dropdown">

                  <h4>Notifications</h4>

                  {notifications.length > 0 ? (

                    notifications.map(
                      (item, index) => (

                        <div
                          key={index}
                          className="notification-item"
                        >
                          {item.text}
                        </div>

                      )
                    )

                  ) : (

                    <div className="notification-item">
                      No Notifications
                    </div>

                  )}

                </div>

              )}

            </div>

            {/* BUTTON */}

            <button
              className="campaign-btn"
              onClick={() =>
                navigate("/sendmessage")
              }
            >
              + New Campaign
            </button>

          </div>

        </div>

        {/* STATS */}

        <div className="stats-grid">

          <MetricCard
            title="Total Emails Sent"
            valueId="emailsSent"
            trend="+12.5%"
          />

          <MetricCard
            title="Average Open Rate"
            valueId="openRate"
            suffix="%"
            trend="+3.2%"
          />

          <MetricCard
            title="Delivery Rate"
            valueId="clickRate"
            suffix="%"
            trend="+1.8%"
          />

          <MetricCard
            title="Active Recipients"
            valueId="revenue"
            trend="+8.4%"
          />

        </div>

      </main>

    </div>

  );

}

/* ================= METRIC CARD ================= */

function MetricCard({
  title,
  valueId,
  prefix = "",
  suffix = "",
  trend,
}) {

  return (

    <div className="metric-card">

      <p>{title}</p>

      <h2 id={valueId}>
        {prefix}0{suffix}
      </h2>

      <span>
        {trend} vs last month
      </span>

    </div>

  );

}

/* ================= COUNTER ================= */

function animateCounter(id, target) {

  const el =
    document.getElementById(id);

  if (!el) return;

  let start = 0;

  const duration = 2000;

  const increment =
    target / (duration / 16);

  const counter = setInterval(() => {

    start += increment;

    if (start >= target) {

      start = target;

      clearInterval(counter);

    }

    if (
      id === "openRate" ||
      id === "clickRate"
    ) {

      el.innerText =
        start.toFixed(1) + "%";

    }

    else {

      el.innerText =
        Math.floor(start)
          .toLocaleString();

    }

  }, 16);

}
