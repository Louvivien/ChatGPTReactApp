import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

function App() {
  const [input, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [enrichedWithGoogleResults, setEnrichedWithGoogleResults] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send a request to the server with the prompt
    axios
      .post("/chat", { input, enrichedWithGoogleResults })
      .then((res) => {
        // Update the response state with the server's response
        setResponse(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
    

  return (
    <div className="container-fluid">
  <div className="row">
    <div className="col-12">
      <h1>React app ChatGPT</h1>
      <p>This React app is connected to ChatGPT. The problem with ChatGPT is that it is normally not connected to internet, it is trained on data from 2021</p>
    </div>
  </div>
  <div className="container bg-light p-3">
  <h3>Directions</h3>
  <p>Try the following prompts with or without Google :</p>
  <ul>
    <li>Who won the 2022 world cup?</li>
    <li>Mike's mom has four kids, penny, nickel, dime, and...what is the name of the fourth kid?</li>
    <li>Who is Vivien Richaud?</li>
    <li>What happened to Benedict XVI?</li>
  </ul>
</div>
  <div className="row mt-5">
    <div className="col-12">
    <Form className="form-inline" onSubmit={handleSubmit}>
    <FormGroup switch>
        <Input
          type="switch"
          checked={enrichedWithGoogleResults}
          onChange={(e) => setEnrichedWithGoogleResults(e.target.checked)}
              
        />
        <Label check>Enriched with Google results</Label>
      </FormGroup>
  <FormGroup>
    <Label for="prompt">Enter your message:</Label>
    <Input
      type="text"
      id="prompt"
      value={input}
      onChange={(e) => setPrompt(e.target.value)}
    />
  </FormGroup>
  <Button color="primary">Submit</Button>
</Form>
<p className="mt-3 text-center">
  {response ? (
    <>
      <img src="/images/logochatgpt.jpeg" alt="ChatGPT logo" />
      {response}
    </>
  ) : null}
</p>
    </div>
  </div>
</div>

  );
}

export default App;