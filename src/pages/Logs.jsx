import React from 'react'; // Import React
import "../styles/theme.css";

function Logs() { // Create function
  const history = ["User Logged In", "New Contact Added", "Message Sent"]; // Static history list

  return ( // Start UI
    <div style={{ padding: '20px' }}> {/* Container */}
      <h2>Activity Logs</h2> {/* Heading */}
      {history.map((log, index) => ( // Loop through history
        <p key={index} style={{ borderBottom: '1px solid #ddd' }}>🕒 {log}</p> // Show each log with emoji
      ))}
    </div>
  );
}

export default Logs; // Export for App.js