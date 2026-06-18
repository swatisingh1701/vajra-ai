import phishingRoute from "./routes/phishing.js";
import urlRoute from "./routes/urlScanner.js";
import ipRoute from "./routes/ipLookup.js";

app.use("/api/phishing", phishingRoute);
app.use("/api/urlscanner", urlRoute);
app.use("/api/iplookup", ipRoute);

const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// ---------------- URL SCANNER ----------------

app.post("/api/urlscan", async (req, res) => {

    try {

        const response = await axios.post(

            "https://www.virustotal.com/api/v3/urls",

            new URLSearchParams({
                url: req.body.url
            }),

            {
                headers: {
                    "x-apikey": process.env.VIRUSTOTAL_API_KEY
                }
            }

        );

        res.json(response.data);

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// ---------------- IP INFO ----------------

app.get("/api/ip/:ip", async (req, res) => {

    try {

        const response = await axios.get(

            `https://ipinfo.io/${req.params.ip}?token=${process.env.IPINFO_API_KEY}`

        );

        res.json(response.data);

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


app.listen(3000, () => {

    console.log("Node server running on port 3000");

});