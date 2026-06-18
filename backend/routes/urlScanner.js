import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {

    const { url } = req.body;

    try {

        const response = await fetch(
            "https://www.virustotal.com/api/v3/urls",
            {
                method: "POST",

                headers: {
                    "x-apikey":
                        process.env.VIRUSTOTAL_API_KEY,

                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },

                body:
                    `url=${encodeURIComponent(url)}`
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