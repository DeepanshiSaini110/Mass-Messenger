import React, {useState} from "react";
import "../styles/Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch("https://api.example.com/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error("Login failed");
            }
            const data = await response.json();
            console.log("Login successful:", data);
        }
        catch (err) {
            setError(err.message);
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
                    <button type="submit">Login</button>
                </form>
            </div>
       
    );
}
export default Login;
