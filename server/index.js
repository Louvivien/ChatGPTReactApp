require('dotenv').config()
const path = require('path');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const request = require('request');

//configuration OPENAI GPT
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI,
  });
  const openai = new OpenAIApi(configuration);

// Set up the server
const app = express();
app.use(bodyParser.json());
app.use(cors())

// Set up the ChatGPT endpoint
app.post("/chat", async (req, res) => {
  // Get the prompt from the request
  const { input } = req.body;

// Generate a response with ChatGPT
const completion = await openai.createCompletion({
  model: 'text-davinci-003',
  prompt: `
I want you to reply to all my questions in markdown format. 
Q: ${input}?.
A: `,
  temperature: 0.5,
  max_tokens: 500,
  top_p: 0.5,
  frequency_penalty: 0.5,
  presence_penalty: 0.2,
  });
  const response = completion.data.choices[0].text;
  res.send(response);
});


  // Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
