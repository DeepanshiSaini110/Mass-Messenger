import React ,{ useState } from "react";
import "../styles/theme.css";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";


const Auth = ({ onAuth }) => {
    
    const[isSignUp, setIsSignUp] = useState(false);
    const[email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        if(!email || !password){
            setError("Please fill all the fields");
            return;
        }
        if(isSignUp){
    
            localStorage.setItem("users", JSON.stringify({email, password}));
            setError("Sign Up Successful! Please Login.");
            setIsSignUp(false);
            setEmail("");
            setPassword("");
        }
        else{
            const storedUsers = JSON.parse(localStorage.getItem("users"));
            if(storedUsers && storedUsers.email === email && storedUsers.password === password){
                localStorage.setItem("isAuthenticated", "true");
                if(onAuth){
                    onAuth(true);
                }
                navigate("/controlcenter");
            }
            else{
                setError("Invalid email or password");
            }
        }
    };
    return (
        <div className="auth-container bg-cyber bg-grid">
            <div className="auth-card">
                <h2>Login Form</h2>
                <div className="box">
                    <button className={isSignUp ? "" : "active"} onClick={() => setIsSignUp(false)}>Login</button>
                    <button className={isSignUp ? "active" : ""} onClick={() => setIsSignUp(true)}>Sign Up</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
