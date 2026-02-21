import React, { useState, useEffect } from "react";
import "../styles/theme.css";
import "../styles/SendMessage.css";
import api from "./api";

const SendMessage = () => {
  const [channel, setChannel] = useState("email");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);

  const [sendType, setSendType] = useState("all"); 
  const [allRecipients, setAllRecipients] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  
  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const res = await api.get("/api/recipients");

        const list =
          channel === "email"
            ? res.data.filter(r => r.email).map(r => r.email)
            : res.data.filter(r => r.phone).map(r => r.phone);

        setAllRecipients(list);
        setSelectedRecipients([]);
      } catch (err) {
        console.error("Failed to load recipients");
      }
    };

    fetchRecipients();
  }, [channel]);

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

    const recipientsToSend =
      sendType === "all" ? allRecipients : selectedRecipients;

    if (recipientsToSend.length === 0) {
      alert("Please select at least one recipient");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("channel", channel);
      formData.append("title", title);
      formData.append("message", message);
      formData.append("recipients", JSON.stringify(recipientsToSend));

      if (attachment) {
        formData.append("attachment", attachment);
      }

      await api.post("/api/send-msg-all", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Message sent successfully ✅");

      setTitle("");
      setMessage("");
      setAttachment(null);
      setSelectedRecipients([]);

    } catch (err) {
      alert(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to send message ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-page bg-cyber bg-grid">
      <div className="send-wrapper">
        <form onSubmit={handleSubmit}>

          <div className="header">
            <h1 className="page-title">Send Message</h1>
            <p className="page-subtitle">Send bulk messages easily</p>
          </div>

          <div className="tabs">
            <button
              type="button"
              className={channel === "email" ? "active" : ""}
              onClick={() => setChannel("email")}
            >
              Email 📧
            </button>
            <button
              type="button"
              className={channel === "sms" ? "active" : ""}
              onClick={() => { setChannel("sms"); setTitle(""); }}
            >
              SMS 📩
            </button>
            <button
              type="button"
              className={channel === "whatsapp" ? "active" : ""}
              onClick={() => { setChannel("whatsapp"); setTitle(""); }}
            >
              WhatsApp 💬
            </button>
          </div>

          <div className="form-container">

            <label>Send To:</label>
            <select value={sendType} onChange={(e) => setSendType(e.target.value)}>
              <option value="all">All Recipients</option>
              <option value="selected">Selected Recipients</option>
            </select>

            {sendType === "selected" && (
              <div className="recipient-list">
                {allRecipients.map((r, index) => (
                  <label key={index} className="recipient-item">
                    <input
                      type="checkbox"
                      checked={selectedRecipients.includes(r)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRecipients([...selectedRecipients, r]);
                        } else {
                          setSelectedRecipients(
                            selectedRecipients.filter(x => x !== r)
                          );
                        }
                      }}
                    />
                    {r}
                  </label>
                ))}
              </div>
            )}
            <br /><br />
            {channel === "email" && (
              <>
                <label>Subject:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Email Subject"
                />
              </>
            )}   
            <label>Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
            />
            <br /><br />
            <label>Attachment (Any File):</label>
            <input
              type="file"
              onChange={(e) => setAttachment(e.target.files[0])}
            />
            <div className="footer">
              <div className="radio-container">
                <label className="radio-item">
                  <input type="radio" name="send" defaultChecked />
                  <span>Send Now</span>
                </label>
                <label className="radio-item">
                  <input type="radio" name="send" />
                  <span>Schedule for later</span>
                </label>
              </div>
              <button type="submit" className="send-button" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default SendMessage;