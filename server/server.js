require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Validate API key exists
if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set in .env file');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store messages (in real app use MongoDB)
const messages = [];

// Simple cache to avoid duplicate API calls
const cache = {
  corrections: new Map(),
  predictions: new Map()
};

// Clear cache every 5 minutes to prevent unbounded growth
setInterval(() => {
  cache.corrections.clear();
  cache.predictions.clear();
  console.log('🗑️ Cache cleared');
}, 5 * 60 * 1000);

// Rate limiting: 10 requests per minute (free tier limit)
const MAX_REQUESTS_PER_MINUTE = 10;
let requestCount = 0;
let minuteStartTime = Date.now();

const checkRateLimit = () => {
  const now = Date.now();
  const timePassed = now - minuteStartTime;
  
  // Reset counter every minute
  if (timePassed >= 60000) {
    requestCount = 0;
    minuteStartTime = now;
  }
  
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    throw new Error('Rate limit exceeded. Please wait before making another request.');
  }
  
  requestCount++;
};

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('message', (msg) => {
    messages.push(msg);
    io.emit('message', msg);
  });
  socket.on('disconnect', () => console.log('User disconnected'));
});

// Fix Text with Gemini
app.post('/api/fix-text', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });

  // Check cache first
  if (cache.corrections.has(text)) {
    console.log('📦 Correction from cache');
    return res.json({ corrected: cache.corrections.get(text) });
  }

  // Check rate limit
  try {
    checkRateLimit();
  } catch (limitError) {
    console.warn('⏱️ Rate limit check failed');
    return res.status(429).json({ 
      error: "Taking a breather... please wait a moment before trying again.",
      retryAfter: 10
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Correct spelling, grammar, and improve clarity of this chat message. Keep tone casual and professional. Only return the corrected text, no quotes or explanation.\n\nMessage: "${text}"`;

    const result = await model.generateContent(prompt);
    const corrected = (await result.response.text()).trim();
    const responseText = corrected + " (fixed by AI)";

    // Store in cache
    cache.corrections.set(text, responseText);

    res.json({ corrected: responseText });
  } catch (error) {
    console.error("Gemini fix error:", error.message);
    
    // Handle rate limit errors
    if (error.status === 429) {
      return res.status(429).json({ 
        error: "API rate limit exceeded. Please wait a moment.",
        retryAfter: 60
      });
    }
    
    // Handle API key errors
    if (error.message.includes('API_KEY_INVALID') || error.status === 400) {
      return res.status(400).json({ error: "Invalid Gemini API key." });
    }
    
    res.status(500).json({ error: "Correction not available right now." });
  }
});

// Predict next words
app.post('/api/predict-words', async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === "" || text.endsWith(" ")) {
    return res.json({ predictions: [] });
  }

  // Check cache first
  if (cache.predictions.has(text)) {
    console.log('📦 Predictions from cache');
    return res.json({ predictions: cache.predictions.get(text) });
  }

  // Check rate limit
  try {
    checkRateLimit();
  } catch (limitError) {
    console.warn('⏱️ Rate limit check failed');
    return res.status(429).json({ 
      predictions: [],
      error: "Rate limited"
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Suggest exactly 3 short, likely next words or phrases for this incomplete message. Return only a JSON array like ["hello", "thanks", "today"]. Message: "${text}"`;

    const result = await model.generateContent(prompt);
    let response = await result.response.text();
    response = response.replace(/```json|```/g, '').trim();

    let predictions = [];
    try {
      predictions = JSON.parse(response);
    } catch {
      predictions = response.split('\n').filter(Boolean).slice(0, 3);
    }

    predictions = predictions.slice(0, 3);
    
    // Store in cache
    cache.predictions.set(text, predictions);

    res.json({ predictions });
  } catch (error) {
    console.error("Prediction error:", error.message);
    
    // Handle rate limit errors
    if (error.status === 429) {
      return res.status(429).json({ 
        predictions: [],
        error: "Rate limited"
      });
    }
    
    // Handle API key errors
    if (error.message.includes('API_KEY_INVALID') || error.status === 400) {
      return res.status(400).json({ 
        predictions: [],
        error: "Invalid API key"
      });
    }
    
    res.json({ predictions: [] });
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✨ AI Features Active with Gemini API`);
  console.log(`🔑 API Key Status: ${process.env.GEMINI_API_KEY ? 'Configured' : 'NOT CONFIGURED'}`);
  console.log(`⏱️ Rate Limit: ${MAX_REQUESTS_PER_MINUTE} requests per minute`);
});