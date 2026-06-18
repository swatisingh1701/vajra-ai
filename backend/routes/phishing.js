import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {

    const { message } = req.body;

    try {

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        `Bearer ${process.env.GROQ_API_KEY}`
                },

                body: JSON.stringify({

                    model: "llama-3.3-70b-versatile",

                    messages: [
                        {
                            role: "system",
                            content:
`You are a cybersecurity expert.

Always reply EXACTLY in this format:

Risk Level: Low Risk / Moderate Risk / High Risk
Indicators: comma separated indicators
Recommendation: short recommendation`
                        },

                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        res.json(data);

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

export default router;