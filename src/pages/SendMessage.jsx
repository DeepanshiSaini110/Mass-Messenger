import React,{useState} from "react";
import "../styles/SendMessage.css";

const SendMessage = ({ onSend }) => {
  const[channel, setChannel] = useState("email");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSend) {
      onSend({ channel, title, message });
    }
    setMessage("");
    setTitle("");
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h2>Send a Message</h2>
      </div>
      <div className="tabs">
        <button className={channel === "email" ? "active" : ""} onClick={() => setChannel("email")}>Email📧</button>
        <button className={channel === "sms" ? "active" : ""} onClick={() => setChannel("sms")}>SMS📩</button>
        <button className={channel === "whatsapp" ? "active" : ""} onClick={() => setChannel("whatsapp")}>WhatsApp💬</button>
      </div>
      <div className="form-container">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          placeholder={`Enter ${channel.charAt(0).toUpperCase() + channel.slice(1)} Title`}
        />
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message here..."
        />
        <div className="footer">
          <div className="radio-container">
            <label className="radio-item"><input type="radio" name="send" defaultChecked/> <span>Send Now </span>    </label>

            <label className="radio-item"><input type="radio" name="send" /> <span>Schedule for later</span> </label>
          </div>
          <div>
            <button className="send-button" onClick={handleSubmit}>Send Message</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SendMessage;