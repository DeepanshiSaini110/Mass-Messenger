import React from "react";
import "../styles/Landing.css";
import "../styles/theme.css";
import { useNavigate } from "react-router-dom";

export default function Landing() {

  const navigate = useNavigate();

  return (

    <div className="landing-page bg-cyber bg-grid">

      {/* NAVBAR */}

      <header className="navbar">

        <div className="logo">
          <span className="logo-icon">💬</span>
          <div>
            <h2>BULK SENDER</h2>
          </div>
        </div>

        <nav className="nav-links">

          <a href="/">Home</a>
          <a href="/">Features</a>
          <a href="/">Pricing</a>
          <a href="/">How It Works</a>
          <a href="/">Resources</a>

        </nav>

        <div className="nav-actions">

          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>

          <button
            className="signup-btn"
            onClick={() => navigate("/login")}
          >
            Sign Up Free
          </button>

        </div>

      </header>

      {/* HERO */}

      <section className="hero-section">

        {/* LEFT */}

        <div className="hero-left">

          <div className="trusted-badge">
            ✔ Trusted by 10,000+ Businesses
          </div>

          <h1>
            Send Messages.
            <br />
            <span>Reach Everyone.</span>
          </h1>

          <p>
            Mass Messenger helps you connect with
            thousands of people in seconds.
            Send bulk messages via SMS,
            WhatsApp, Email and more —
            all from one platform.
          </p>

          <div className="hero-points">

            <div>✔ High Delivery Rate</div>

            <div>✔ Easy to Use</div>

            <div>✔ Secure & Reliable</div>

            <div>✔ 24/7 Support</div>

          </div>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/login")}
            >
              Start Sending Now
            </button>

            <button className="secondary-btn">
              Book a Demo
            </button>

          </div>

        </div>

        {/* RIGHT */}

        <div className="hero-right">

          <div className="dashboard-preview">

            <div className="sidebar-demo">

              <h3>Mass Messenger</h3>

              <ul>

                <li className="active">
                  Dashboard
                </li>

                <li>Contacts</li>

                <li>Campaigns</li>

                <li>Reports</li>

                <li>Settings</li>

              </ul>

            </div>

            <div className="dashboard-content">

              <div className="preview-top">

                <div className="mini-card">
                  <h4>Messages Sent</h4>
                  <p>125,680</p>
                </div>

                <div className="mini-card">
                  <h4>Delivered</h4>
                  <p>120,450</p>
                </div>

                <div className="mini-card">
                  <h4>Delivery Rate</h4>
                  <p>96.3%</p>
                </div>

              </div>

              <div className="chart-box">

                <div className="fake-chart"></div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CHANNELS */}

      <section className="channels-section">

        <h2>
          One Platform. Multiple Channels.
        </h2>

        <div className="channel-grid">

          <div className="channel-card">
            📱 SMS
          </div>

          <div className="channel-card">
            💬 WhatsApp
          </div>

          <div className="channel-card">
            📧 Email
          </div>

          <div className="channel-card">
            📞 Voice Call
          </div>

          <div className="channel-card">
            ✈ Telegram
          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section className="features-section">

        <h2>
          Everything You Need
        </h2>

        <p>
          Powerful tools to manage and scale
          communication.
        </p>

        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">
              ⚡
            </div>

            <h3>Bulk Messaging</h3>

            <p>
              Send thousands of messages
              instantly.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              👥
            </div>

            <h3>Contact Management</h3>

            <p>
              Organize and manage recipients.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              📊
            </div>

            <h3>Analytics</h3>

            <p>
              Track campaign performance
              in realtime.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              🔗
            </div>

            <h3>API Integration</h3>

            <p>
              Connect your own apps easily.
            </p>

          </div>

        </div>

      </section>

      {/* STATS */}

      <section className="stats-section">

        <div>
          <h2>10,000+</h2>
          <p>Happy Customers</p>
        </div>

        <div>
          <h2>250M+</h2>
          <p>Messages Delivered</p>
        </div>

        <div>
          <h2>99.9%</h2>
          <p>Uptime</p>
        </div>

        <div>
          <h2>24/7</h2>
          <p>Support</p>
        </div>

      </section>

      {/* HOW IT WORKS */}

      <section className="steps-section">

        <h2>
          Get Started in 3 Simple Steps
        </h2>

        <div className="steps-grid">

          <div className="step-card">
            <span>1</span>
            <h3>Create Account</h3>
            <p>
              Sign up and access dashboard.
            </p>
          </div>

          <div className="step-card">
            <span>2</span>
            <h3>Upload Contacts</h3>
            <p>
              Import recipients easily.
            </p>
          </div>

          <div className="step-card">
            <span>3</span>
            <h3>Send & Track</h3>
            <p>
              Launch campaigns instantly.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="cta-section">

        <div>

          <h2>
            Ready to Reach More People?
          </h2>

          <p>
            Join thousands of businesses using
            Mass Messenger.
          </p>

        </div>

        <button
          onClick={() => navigate("/login")}
        >
          Start Free Trial
        </button>

      </section>

      {/* FOOTER */}

      <footer className="footer">

        <div>

          <h3>Mass Messenger</h3>

          <p>
            Modern communication platform for
            bulk messaging.
          </p>

        </div>

        <div className="footer-links">

          <a href="/">Features</a>

          <a href="/">Pricing</a>

          <a href="/">API</a>

          <a href="/">Contact</a>

        </div>

      </footer>

    </div>

  );

}