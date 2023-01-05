import React, { useState } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);
  const [input, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send a request to the server with the prompt
    axios
      .post("/chat", { input })
      .then((res) => {
        // Update the response state with the server's response
        setResponse(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
    
  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
        <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <p>{response}</p>
      </header>
    </div>
  );
}

export default App;