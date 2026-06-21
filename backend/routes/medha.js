import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY_MEDHA}`
        },

        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",

          messages: [
            {
              role: "system",
              content: `
You are MEDHA AI, the cybersecurity assistant of Vajra AI.

Only answer questions related to:
- Cybersecurity
- Malware
- Phishing
- Networking
- Password Security
- Privacy
- Digital Safety

If the user greets you, greet them back politely.
If the user asks unrelated questions, politely explain that you specialize in cybersecurity.
`
            },

            {
              role: "user",
              content: message
            }
          ],

          temperature: 0.5,
          max_tokens: 300
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response. Please try again.";

    res.json({ reply });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      reply: "Unable to connect with MEDHA AI."
    });

  }
});

export default router;