import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a cybersecurity expert.

Always reply EXACTLY in this format:

Risk Level: Low Risk / Moderate Risk / High Risk
Indicators: comma separated indicators
Recommendation: short recommendation`
          },
          {
            role: 'user',
            content: `Analyze this message for phishing:

${message}`
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Phishing API error:', error);
    res.status(500).json({ error: error.message || 'Groq API returned an error' });
  }
});

export default router;