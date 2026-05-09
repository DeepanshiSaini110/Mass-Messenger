import React, { useEffect, useState } from "react";
import "../styles/Audience.css";
import api from "./api";

export default function Audience() {

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [audience, setAudience] = useState([]);

  useEffect(() => {
    loadAudience();
  }, []);

  /* LOAD RECIPIENTS */

  const loadAudience = async () => {

    try {

      const res = await api.get("/api/recipients");

      setAudience(res.data);

    } catch (err) {

      console.log("Audience Error:", err);

    }

  };

  /* ADD RECIPIENT */

  const addRecipient = async () => {

    if (!name || !email) {
      return alert("Please fill all required fields");
    }

    try {

      await api.post("/api/recipients", {
        name,
        email,
        phone
      });

      setName("");
      setEmail("");
      setPhone("");

      setShowForm(false);

      loadAudience();

    } catch (err) {

      console.log(err);

    }

  };

  /* DELETE RECIPIENT */

  const deleteRecipient = async (id) => {

    try {

      await api.delete(`/api/recipients/${id}`);

      setAudience(
        audience.filter((item) => item._id !== id)
      );

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div className="audience-page bg-cyber bg-grid">

      {/* HEADER */}

      <div className="audience-header">

        <div>

          <h1>Audience</h1>

          <p>
            Manage all recipients and subscribers
          </p>

        </div>

        <button
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          + Add Recipient
        </button>

      </div>

      {/* FORM */}

      {showForm && (

        <div className="add-form">

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button onClick={addRecipient}>
            Save Recipient
          </button>

        </div>

      )}

      {/* TABLE */}

      <div className="audience-table">

        <table>

          <thead>

            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Created</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {audience.length > 0 ? (

              audience.map((user) => (

                <tr key={user._id}>

                  <td>{user.name}</td>

                  <td>{user.email || "-"}</td>

                  <td>{user.phone || "-"}</td>

                  <td>
                    {new Date(user.createdAt)
                      .toLocaleDateString()}
                  </td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteRecipient(user._id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="5" className="empty">
                  No Recipients Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}