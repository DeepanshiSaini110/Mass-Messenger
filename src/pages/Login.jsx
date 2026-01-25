import React, {useState} from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (email.trim() === "" || password.trim() === "") {
        setError("Please enter both email and password.");
        return;
    }

    if (email === "admin@example.com" && password === "admin123") {
        console.log("Login successful");
        navigate("/send-message"); 
    } else {
        setError("Invalid email or password.");
    }
};

    return (
            <div className="login-container">
                <form className="login-card" onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required/>
                    </div>
                    <br />
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    </div>
                    <br /> <br />
                    <button  type="submit">Login</button>
                </form>
            </div>
       
    );
}
export default Login;
