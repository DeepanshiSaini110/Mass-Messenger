import React,{useState} from "react";
import "../styles/theme.css";
import "../styles/SendMessage.css";
import api from "./api";



const SendMessage = ({ onSend }) => {
  const[channel, setChannel] = useState("email");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!message) {
    alert("Please enter message");
    return;
  }
  if (channel === "email" && !title) {
    alert("Please enter email subject");
    return;
  }
  try {
    setLoading(true);
    const recipientsRes = await api.get("/api/recipients");
    let recipients = [];
    if (channel === "email") {
      recipients = recipientsRes.data.filter(r => r.email).map(r => r.email);
    } else {
      recipients = recipientsRes.data.filter(r => r.phone).map(r => r.phone);
    }

    if (recipients.length === 0) {
      alert("No valid recipients for this channel");
      setLoading(false);
      return;
    }

    await api.post("/api/send-msg-all", {channel,title,message,recipients,});

    alert("Message sent successfully ✅");
    setTitle("");
    setMessage("");

  } catch (err) {
    alert(
      err.response?.data?.error ||err.response?.data?.message ||"Failed to send message ❌"
    );
  } finally {
    setLoading(false);
  }
};




  return (
   <div className="send-page bg-cyber bg-grid" >
    <div className="send-wrapper">
      <form onSubmit={handleSubmit}>

        <div className="header">
          <h1 className="page-title">Send Message</h1>
          <p className="page-subtitle">Send bulk messages easily</p>
</div>

      <div className="tabs">
        <button type="button" className={channel === "email" ? "active" : ""} onClick={() => setChannel("email")}>Email📧</button>
        <button type="button" className={channel === "sms" ? "active" : ""} onClick={() => {setChannel("sms");setTitle("");}}
>SMS📩</button>
        <button type="button" className={channel === "whatsapp" ? "active" : ""} onClick={() => {setChannel("whatsapp");setTitle("");}}
>WhatsApp💬</button>
      </div>
      <div className="form-container">
        {channel === "email" && (
  <>
    <label htmlFor="title">Subject:</label>
    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
      placeholder="Enter Email Subject"
    />
  </>
)}

      

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
            <button type="submit" className="send-button" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
              </button>

          </div>
        </div>
      </div>
      </form>
    </div>
    </div>
  );
};

export default SendMessage;