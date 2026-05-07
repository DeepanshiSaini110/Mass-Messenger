import React from "react";
import "../styles/ControlCenter.css";
import { useNavigate } from "react-router-dom";
import "../styles/theme.css";
export default function ControlCenter(){
    const navigate=useNavigate();
    return(
        <div className="page bg-cyber bg-grid">
            <div className="container">
                <header className="header fade-up">
                    <p className="brand">&lt;/&gt;Mass Messenger &lt;/&gt;</p> <br />
                    <h1>Control Center</h1>
                    <p className="subtitle">Select an Option to Continue</p>
                </header>
                <section className="control-cards">
                    <div className="menu-card fade-up d1" onClick={() => navigate("/dashboard")}>
                        <div className="icon1">📊</div>
                        <h3>Dashboard</h3>
                        <p>View Analytics & Overview</p>
                    </div>
                    <div className="menu-card fade-up d2" onClick={() => navigate("/recepients")}>
                        <div className="icon2 ">👥</div>
                        <h3>Recepients</h3>
                        <p>Manage Contact List</p>
                    </div>
                    <div className="menu-card fade-up d3" onClick={() => navigate("/logs")}>
                        <div className="icon3">📜</div>
                        <h3>Logs</h3>
                        <p>View Activity History</p>
                    </div>
                    <div className="menu-card fade-up d4" onClick={() => navigate("/sendmessage")}>
                        <div className="icon4">🚀</div>
                        <h3>Send Message</h3>
                        <p>Compose & Send Messages</p>
                    </div>
                </section>
            </div>
        </div>
    );
}