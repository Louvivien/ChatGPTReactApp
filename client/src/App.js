import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import ReactGA from 'react-ga';
  const TRACKING_ID = "G-HBNG0CCQGL"; 
  ReactGA.initialize(TRACKING_ID);
  ReactGA.pageview(window.location.pathname + window.location.search);

  

function App() {
  const [input, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [enrichedWithGoogleResults, setEnrichedWithGoogleResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT


  const handleSubmit = (e) => {
    e.preventDefault();
    // Track Submit in GA
    ReactGA.event({
      category: 'Submit',
      action: 'Submitted a question'
    });  
    // Set isLoading to true before sending the request
      setIsLoading(true);
    // Send a request to the server with the prompt
    axios
      .post(`${API_ENDPOINT}/chat`, { input, enrichedWithGoogleResults })
      .then((res) => {
        // Update the response state with the server's response
        setResponse(res.data);
        // Set isLoading to false
        setIsLoading(false);
        // Reset isLoading to false after the response has been displayed
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

 

  return (
  <Container fluid>
 <Row>
        <Col xs={12}>
          <h1>React app ChatGPT</h1>
          <p>This React app is connected to ChatGPT. The problem with ChatGPT is that it is normally not connected to internet, it is trained on data from 2021</p>
        </Col>
      </Row>
      <Row>

        <Col xs={12} className="bg-light p-3">
          <h3>Directions</h3>
          <p>Try the following prompts with or without Google :</p>
          <ul>
            <li>Who won the 2022 world cup?</li>
            <li>Mike's mom has four kids, penny, nickel, dime, and...what is the name of the fourth kid?</li>
            <li>Who is Vivien Richaud?</li>
            <li>What happened to Benedict XVI?</li>
          </ul>
        </Col>

      </Row>

      <Row className="mt-5">
        <Col xs={12}>
          <Form onSubmit={handleSubmit}>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  checked={enrichedWithGoogleResults}
                  onChange={(e) => setEnrichedWithGoogleResults(e.target.checked)}
                />{' '}
                Enriched with Google results
              </Label>
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
            <div className="text-center">
                <Button color="primary" type="submit">Submit</Button>
            </div>
          </Form>
        </Col>
      </Row>


{isLoading ? (

<div style={{ marginTop: "10px", }}>

  <Container>
      <Row>
        <Col className="text-center">Loading...</Col>
      </Row>
  </Container>

</div>

) : (

<div>
  {response ? (
    <Container style={{ marginTop: '20px' }}>
      <Row>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <img src="/images/logochatgpt.jpeg" alt="ChatGPT logo" />
          <div style={{ marginLeft: '10px' }}>{response}</div>
        </div>
      </Row>
    </Container>
  ) : null}
</div>


)}

</Container>



  );
}

export default App;