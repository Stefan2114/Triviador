import React, { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8081/api/game/hello")
      .then((response) => response.text())
      .then((data) => setMessage(data));
  }, []);

  return (
    <div>
      <h1>Triviador Clone</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;
