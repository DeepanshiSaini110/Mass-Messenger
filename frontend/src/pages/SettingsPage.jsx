import React, { useState } from "react";
import "../styles/SettingsPage.css";
import "../styles/theme.css";

export default function SettingsPage() {

  const [settings, setSettings] = useState({
    appName: "Mass Messenger",
    emailNotifications: true,
    darkMode: true,
    autoBackup: false,
    twilioNumber: "+91XXXXXXXXXX",
    supportEmail: "support@massmessenger.com",
  });

  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const saveSettings = () => {
    alert("Settings Saved Successfully");
  };

  return (
    <div className="settings-page bg-cyber bg-grid">

      <div className="settings-header">

        <div>
          <h1>Settings</h1>
          <p>Manage application preferences and configurations</p>
        </div>

        <button
          className="save-btn"
          onClick={saveSettings}
        >
          Save Changes
        </button>

      </div>

      {/* GENERAL SETTINGS */}

      <div className="settings-card">

        <h2>General Settings</h2>

        <div className="input-group">

          <label>Application Name</label>

          <input
            type="text"
            name="appName"
            value={settings.appName}
            onChange={handleChange}
          />

        </div>

        <div className="input-group">

          <label>Support Email</label>

          <input
            type="email"
            name="supportEmail"
            value={settings.supportEmail}
            onChange={handleChange}
          />

        </div>

      </div>

      {/* TWILIO */}

      <div className="settings-card">

        <h2>Messaging Settings</h2>

        <div className="input-group">

          <label>Twilio Number</label>

          <input
            type="text"
            name="twilioNumber"
            value={settings.twilioNumber}
            onChange={handleChange}
          />

        </div>

      </div>

      {/* TOGGLES */}

      <div className="settings-card">

        <h2>Preferences</h2>

        <div className="toggle-row">

          <div>
            <h3>Email Notifications</h3>
            <p>Receive email alerts and updates</p>
          </div>

          <button
            className={
              settings.emailNotifications
                ? "toggle active"
                : "toggle"
            }
            onClick={() =>
              handleToggle("emailNotifications")
            }
          >
            <div className="circle"></div>
          </button>

        </div>

        <div className="toggle-row">

          <div>
            <h3>Dark Mode</h3>
            <p>Enable dark theme interface</p>
          </div>

          <button
            className={
              settings.darkMode
                ? "toggle active"
                : "toggle"
            }
            onClick={() =>
              handleToggle("darkMode")
            }
          >
            <div className="circle"></div>
          </button>

        </div>

        <div className="toggle-row">

          <div>
            <h3>Auto Backup</h3>
            <p>Automatically backup campaign data</p>
          </div>

          <button
            className={
              settings.autoBackup
                ? "toggle active"
                : "toggle"
            }
            onClick={() =>
              handleToggle("autoBackup")
            }
          >
            <div className="circle"></div>
          </button>

        </div>

      </div>

    </div>
  );
}