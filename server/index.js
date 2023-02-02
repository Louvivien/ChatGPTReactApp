const dotenv = require('dotenv').config()
const path = require('path');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const request = require('request');
const moment = require("moment");
const jsonFile = require("./data.json"); 

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
  // Get the data from the request from the web client
  const { input, enrichedWithGoogleResults } = req.body;
  //console.log(input, enrichedWithGoogleResults);


//Enrich data with Google
let googleResults;

if (enrichedWithGoogleResults) {
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
  googleResults = await getGoogleResults(input);


  //console.log(googleResults);

}




// Build the prompt to be used for ChatGPT

let prompt = `I want you to reply to all my questions in markdown format.\n`;

let googleResultsString = '';
    if (googleResults && googleResults.items) {
      // We will now transform the Google results so the relative dates are replaced by absolute dates
      let transformedGoogleResults = [];

      // Get the current date using the moment library
      const currentDate = moment();

      // Transform the googleResults.items array and add the transformed items to the transformedGoogleResults array
      for (let i = 0; i < googleResults.items.length; i++) {
        let item = googleResults.items[i];

        // Use a regular expression to find all occurrences of "days ago" or "weeks ago" in the snippet field
        const daysAgoRegex = /(\d+) days ago/gi;
        const weeksAgoRegex = /(\d+) weeks ago/gi;

        // Replace all occurrences of "days ago" with absolute dates
        item.snippet = item.snippet.replace(daysAgoRegex, (match, numberOfDays) => {
          // Calculate the absolute date by subtracting the number of days from the current date
          const absoluteDate = moment(currentDate).subtract(numberOfDays, "days");
          // Format the absolute date in the desired format
          return absoluteDate.format("MMM DD, YYYY");
        });

        // Replace all occurrences of "weeks ago" with absolute dates
        item.snippet = item.snippet.replace(weeksAgoRegex, (match, numberOfWeeks) => {
          // Calculate the absolute date by subtracting the number of weeks from the current date
          const absoluteDate = moment(currentDate).subtract(numberOfWeeks, "weeks");
          // Format the absolute date in the desired format
          return absoluteDate.format("MMM DD, YYYY");
        });

        // Add the transformed item to the transformedGoogleResults array
        transformedGoogleResults.push(item);
      }

      googleResultsString = `As of ${currentDate}, given these web results:\n`;
      for (let i = 0; i < transformedGoogleResults.length; i++) {
        const item = transformedGoogleResults[i];
        googleResultsString += `- **Title:** ${item.title}\n`;
        googleResultsString += `  **URL:** ${item.link}\n`;
        googleResultsString += `  **Snippet:** ${item.snippet}\n`;
        googleResultsString += `  **Display link:** ${item.displayLink}\n`;
      }
    }




prompt += `${googleResultsString}\n\nAnswer the following question:\nQ: ${input}?\nA: `;

console.log(prompt);

// Generate a response with chatGTP
try {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    temperature: 0.5,
    max_tokens: 500,
    top_p: 0.5,
    frequency_penalty: 0.5,
    presence_penalty: 0.2,
  });
  const response = completion.data.choices[0].text;
  res.send(response);
} catch (error) {
  console.error(error);
  res.status(500).send({ error: 'An error occurred while processing the request' });
}


});




  // Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.json({ message: "This React app is connected to ChatGPT" });
});


// Handle GET requests to other routes
app.get("/demo/see-you-around-goodbye-card.json", (req, res) => {
  res.json(jsonFile);
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
