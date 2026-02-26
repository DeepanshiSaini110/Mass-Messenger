import { useEffect, useState } from "react";
import "../styles/theme.css";
import "../styles/Recipients.css";
import api from "./api";

export default function Recipients() {
  const [recipients, setRecipients] = useState([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState(null);

  const loadRecipients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/recipients");
      setRecipients(res.data);
    } catch (err) {
      console.error("LOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipients();
  }, []);

  const addRecipient = async () => {
    if (!name || (!email && !phone)) {
      alert("Enter name and email OR phone");
      return;
    }

    try {
      const res = await api.post("/api/recipients", { name, email, phone });
      setRecipients((prev) => [res.data, ...prev]);
      setName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      console.error("ADD ERROR:", err);
      alert("Failed to add recipient");
    }
  };

  const uploadCSV = async () => {
    if (!csvFile) {
      alert("Please select a CSV file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", csvFile);

      const res = await api.post(
        "/api/recipients/import-csv",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setRecipients((prev) => [...res.data, ...prev]);
      setCsvFile(null);
      alert("CSV imported successfully ✅");
    } catch (err) {
      console.error(err);
      alert("CSV upload failed ❌");
    }
  };

  const deleteRecipient = async (id) => {
    if (!window.confirm("Delete this recipient?")) return;

    try {
      await api.delete(`/api/recipients/${id}`);
      setRecipients((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };


  const filteredRecipients = recipients.filter((r) =>
    [r.name, r.email, r.phone]
      .filter(Boolean)
      .some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div className="recipients-container bg-cyber bg-grid">
      <header className="page-header">
        <div className="title-block">
          <h1 className="page-title">Message Recipients 📬</h1>
          <p className="page-subtitle">Manage Your Contact List</p>
        </div>

        <div className="header-bottom">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <span className="count-badge">
            {recipients.length} recipients
          </span>
        </div>
      </header>

      <div className="add-box styled-add-box horizontal-box">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="add-input"
          />
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="add-input"
          />
          <input
            type="text"
            placeholder="Enter Phone (with country code)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="add-input"
          />
        </div>

        <button className="primary-btn add-btn" onClick={addRecipient}>
          + Add Recipient
        </button>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
        />

        <button className="primary-btn add-btn" onClick={uploadCSV}>
          Import CSV
        </button>
      </div>

      {loading ? (
        <div className="empty-state">
          <h3>Loading recipients...</h3>
        </div>
      ) : filteredRecipients.length === 0 ? (
        <div className="empty-state">
          <h3>No Recipients Found</h3>
        </div>
      ) : (
        <div className="recipient-list">
          {filteredRecipients.map((r) => (
            <div className="recipient-row" key={r._id}>
              <div>
                <h4>{r.name}</h4>
                {r.email && <p>Email: {r.email}</p>}
                {r.phone && <p>Phone: {r.phone}</p>}
              </div>

              <button
                className="danger-btn"
                onClick={() => deleteRecipient(r._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}