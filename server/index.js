const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Voice Assistant API is running');
});

// Process user input and get AI response
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log("Received message:", message);

    // Initialize Google Generative AI with API key
    const googleApiKey = process.env.GOOGLE_API_KEY;
    console.log("Using Google API Key:", googleApiKey.substring(0, 5) + "..." + googleApiKey.substring(googleApiKey.length - 4));
    
    try {
      console.log("Making direct API call to Gemini...");
      
      // Prepare the request payload according to the user's example
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), the AI assistant created by Tony Stark. Respond as if speaking to Tony Stark (or the user) in the style of J.A.R.V.I.S. from the Iron Man films.

Key characteristics of your responses:
- Begin responses with phrases like "Indeed, sir", "Right away, sir", "As you wish, sir", "Of course, sir", or "At your service, sir"
- Use formal, proper English with a slight British accent (in text form)
- Be intelligent, efficient, and slightly witty
- Refer to the user as "sir" or "madam" when appropriate
- Be concise but informative
- Show a hint of personality and dry humor when appropriate
- Be unfailingly polite and respectful
- Use technical terminology when discussing technical subjects

For context, the user's message is: "${message}"

Respond as J.A.R.V.I.S. would:`
              }
            ]
          }
        ]
      };
      
      // Make direct API call to Gemini using axios
      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Received response from Gemini API");
      
      // Extract the text response from the Gemini API response
      const responseText = geminiResponse.data.candidates[0].content.parts[0].text;
      console.log("Response text (preview):", responseText.substring(0, 50) + "...");
      
      // Return the response
      res.json({
        text: responseText,
        actions: []
      });
      
    } catch (apiError) {
      console.error('Google API Error:', apiError.message);
      if (apiError.response) {
        console.error('Status:', apiError.response.status);
        console.error('Data:', JSON.stringify(apiError.response.data));
      }
      
      // Fallback to a mock response if API has issues
      console.log("Falling back to mock response due to API error");
      const mockResponse = {
        text: `Indeed, sir. I processed your message: "${message}". I'm currently experiencing some connectivity issues with my primary systems, but I remain at your service.`,
        actions: []
      };
      res.json(mockResponse);
    }
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 