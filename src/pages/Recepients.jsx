import { useState } from "react";
import "../styles/theme.css";
import "../styles/Recipients.css";

export default function Recipients() {

  const [recipients, setRecipients] = useState([]);
  const [search, setSearch] = useState("");
  const addRecipient = () => {
    const newRecipient = {
      name: "Demo User",
      email: "demo@example.com",
    };
    setRecipients([...recipients, newRecipient]);
  };
  const deleteRecipient = (index) => {
    const updated = recipients.filter((_, i) => i !== index);
    setRecipients(updated);
  };
  const filteredRecipients = recipients.filter(
    (r) =>r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="recipients-container bg-cyber bg-grid">
      <header className="page-header">
        <div>
          <h1 className="page-title">Message Recipients 📬</h1>
          <p className="page-subtitle">
            Manage Your Contact List For Mass Messaging
          </p>
        </div>
        <div className="header-actions">
          <span className="count-badge">{recipients.length} recipients</span>
          <button className="primary-btn" onClick={addRecipient}>
            + Add Recipient
          </button>
        </div>
      </header>
      <br /><br />
      <div className="filter-box">
        <input type="text" placeholder="Search by name or email..." value={search}
          onChange={(e) => setSearch(e.target.value)}/>
      </div>{filteredRecipients.length === 0 ? (
        <div className="empty-state">
          <div className="emoji">📬</div>
          <h3>No Recipients Yet</h3>
          <br />
          <p>Add Your First Recipient to get Started</p>
          <br />
          <button className="primary-btn" onClick={addRecipient}>+ Add Your First Recipient
          </button>
        </div>
      ) : (
        <div className="recipient-list">
          {filteredRecipients.map((r, index) => (
            <div className="recipient-row" key={index}>
              <div>
                <h4>{r.name}</h4>
                <p>{r.email}</p>
              </div>
              <button className="danger-btn"
                onClick={() => deleteRecipient(index)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}