import React from "react";
import "../styles/Landing.css";
import { useNavigate } from "react-router-dom";
import "../styles/theme.css";

const Landing = () => {
    const navigate = useNavigate();
    return(
        <div className="page-wrapper">
            <div className="background-grid"></div>
            <div className="animated"></div>
            <div className="grid-overlay"></div>
            <div className="content">
                <header className="header">
                    <div className="logo">&lt;/&gt; CODEVIRUS SECURITY</div>
                    <div className="nav">
                        <button className="nav-btn" onClick={()=>navigate("/login")}>Login</button>
                        <button className="nav-cta" onClick={()=>navigate("/login")}>Get Started</button>
                    </div>

                        </header>
                <main>
                    <section className="hero">
                        <h1 className="title">Send Messages at Scale</h1>
                        <p className="subtitle">The Ultimate Mass Messenger Platform for Modern Communication.</p>
                        <button className="cta-button" onClick={()=>navigate("/login")}>Get Started</button>
                        <div className="stats">
                            <div>
                                <h3>5000+</h3>
                                <p>Active Users</p>
                                </div>
                                <div>
                                    <h3>1M+</h3>
                                    <p>Messages Sent</p>
                                    </div>
                                    <div>
                                        <h3>99.9%</h3>
                                        <p>Uptime</p>
                                        </div>
                                        </div>

                    </section>
                    <section className="features">
                        <div className="grid">
                            <div className="card">
                                <div className="icon">⚡</div>
                                <h2 className="feature-title">Lightning Fast</h2> <br />
                                <p className="desc">Send messages instantly in seconds with our optimized delivery system.</p>
                            </div>
                            <div className="card">
                                <div className="icon">🔒</div>
                                <h2 className="feature-title">Secure & Private</h2> <br />
                                <p className="desc">End-to-end encryption ensures your messages stay confidential and secure.</p>
                            </div>
                            <div className="card">
                                <div className="icon">📊</div>
                                <h2 className="feature-title"> Analytics Dashboard</h2> <br />
                                <p className="desc">Track delivery rates, campaign performance in real-time.</p>
                            </div>
                        </div>
                    </section>
                    <section className="how-it-works">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">Start sending bulk messages in just three simple steps.
                        </p>
                        <div className="steps-container">
                            <div className="step-card">
                                <div className="step-number">01</div>
                                <h3>Login to Dashboard</h3>
                                <p>Securely access your messaging dashboard to manage campaigns.</p>
                                </div>
                                <div className="arrow">→</div>
                            <div className="step-card">
                                <div className="step-number">02</div>
                                <h3>Add Recipients</h3>
                                <p>Add contacts manually or upload recipients in bulk.</p>
                            </div>
                            <div className="arrow">→</div>
                            <div className="step-card">
                                <div className="step-number">03</div>
                                <h3>Send Message</h3>
                                <p>Create your message and deliver it instantly to all recipients.</p>
                            </div>
                        </div>
                    </section>
                </main>
                <footer className="footer">
                    <p>© 2026 CodeVirus Security. All Rights Reserved.</p>
                </footer>
             </div>
        </div>
    );
};
export default Landing;