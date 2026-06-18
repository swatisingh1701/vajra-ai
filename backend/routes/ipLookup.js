import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/:ip", async (req, res) => {

    try {

        const response = await fetch(

            `https://ipinfo.io/${req.params.ip}/json?token=${process.env.IPINFO_API_KEY}`

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