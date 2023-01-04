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
  const { prompt } = req.body;

 // Get the 10 first results on Google related to this input (server side)
 async function getGoogleResults(query) {
    // Set up the options for the request
    const options = {
      url: 'https://www.googleapis.com/customsearch/v1',
      qs: {
        q: query,
        key: process.env.GOOGLECUSTSEARCHENGINE,
        cx: process.env.GOOGLESEARCHENGINEID,
        num: 10
      }
    };
    // Make the request and return a promise that resolves with the response
  return new Promise((resolve, reject) => {
    request.get(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        // Parse the response as JSON
        const data = JSON.parse(body);
        resolve(data);
      }
    });
  });
    }
    // Get the Google results for the prompt
  const googleResults = await getGoogleResults(prompt);

    // Parse the google results
    function displayGoogleResults(results) {
        if (results && results.items) {
          // Loop through the results and display them
          for (let i = 0; i < results.items.length; i++) {
            const item = results.items[i];
            console.log(`${item.title} - ${item.link}`);
            console.log(`${item.snippet}`);
            console.log(`${item.displayLink}`);
            console.log('');
          }
        } else {
          console.log('No results found');
        }
      }

  displayGoogleResults(googleResults);






// Generate a response with ChatGPT
const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
  });
  res.send(completion.data.choices[0].text);
});
//ici on va modifier le prompt pour inclure les resultats google


app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
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
