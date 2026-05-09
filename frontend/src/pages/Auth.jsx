import React ,{ useState } from "react";
import "../styles/theme.css";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import api from "./api";


const Auth = ({ onAuth }) => {
    
    const[isSignUp, setIsSignUp] = useState(false);
    const[email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    

    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");

  if (!email || !password) {
    setError("Please fill all the fields");
    return;
  }
  try {
    if (isSignUp) {
      await api.post("/auth/register", {
        email,
        password
      });

      setError("Sign Up Successful! Please Login.");
      setIsSignUp(false);
      setEmail("");
      setPassword("");

    } else {
      const res = await api.post("/auth/login", {
        email,
        password
      });
      localStorage.setItem("token", res.data.token);

      if (onAuth) onAuth(true);

      navigate("/dashboard");
    }

  } catch (err) {
  console.log("ERROR:", err.response || err);
  setError(
    err.response?.data?.message || "Server Error"
  );
}
}

    return (
        <div className="auth-container bg-cyber bg-grid">
            <div className="auth-card">
                <h2>{isSignUp ? "Create Account" : "Welcome Back"}</h2>

                <div className="box">
                    <button className={isSignUp ? "" : "active"} onClick={() => setIsSignUp(false)}>Login</button>
                    <button className={isSignUp ? "active" : ""} onClick={() => setIsSignUp(true)}>Sign Up</button>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <p className="error-text">{error}</p>}
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                    
                    <div className="password-box">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />

  <button
    type="button"
    className="show-btn"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>

                    {!isSignUp && (
                        <p className="forgot">Forgot Password?</p>
                    )}
                    <br />
                    <button type="submit" className="submit">{isSignUp ? "Sign Up" : "Login"}</button>
                </form>
                <br />
                <p className="text">{isSignUp?(<>Already a member?{""}<span onClick={()=> setIsSignUp(false)}>Login Now</span> 
                </>
                ):(
                <>
                Not a member?{""}<span onClick={()=> setIsSignUp(true)}>Sign Up Now</span>
                </>
                )}
                </p>
            </div>
        </div>
    );
};

export default Auth;
