import React, { useState } from 'react'; // Import React and useState for memory
import "../styles/theme.css";

function Recipients(props) { // Create function
  const [name, setName] = useState(""); // Variable to store what we type in the name box

  function save() { // Function to save the name
    if (name !== "") { // Check if name is not empty
      props.onAdd(name); // Send name to the Master List in App.js
      setName(""); // Clear the input box
    }
  }

  return ( // Start UI
    <div style={{ padding: '20px' }}> {/* Container */}
      <h2>Manage People</h2> {/* Heading */}
      <input 
        value={name} // Link input to 'name' variable
        onChange={(e) => setName(e.target.value)} // Update 'name' as we type
        placeholder="Enter Name" // Hint text
      />
      <button onClick={save}>Add Contact</button> {/* Click to save */}
      
      <h3>Contact List:</h3> {/* List heading */}
      <ul> {/* Start bullet list */}
        {props.data.map((item, index) => ( // Loop through contacts from App.js
          <li key={index}>{item}</li> // Show each contact as a bullet point
        ))}
      </ul> {/* End list */}
    </div>
  );
}

export default Recipients; // Export for App.js