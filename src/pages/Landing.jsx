import "../styles/Landing.css";
import { useNavigate } from "react-router-dom";

const Landing = () => {
    const navigate = useNavigate();
    return(
        <div className="page-wrapper">
            <div className="background-grid"></div>
            <div className="animated"></div>
            <div className="grid-overlay"></div>
            <div className="content">
                <header className="header">
                    <div className="logo">
                        <span className="icon"></span> &lt;/&gt; CODEVIRUS SECURITY &lt;/&gt;
                    </div>
                </header>
                <main>
                    <section className="hero">
                        <h1 className="title">Send Messages at Scale</h1>
                        <p className="subtitle">The Ultimate Mass Messenger Platform for Modern Communication.</p>
                        <button className="cta-button" onClick={()=>navigate("/login")}>Get Started</button>
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
                </main>
                </div>
        </div>
    );
};
export default Landing;