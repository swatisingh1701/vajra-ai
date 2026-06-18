import { auth, db } from "./firebase-config.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const analyzeBtn = document.getElementById("analyzeBtn");
const messageInput = document.getElementById("messageInput");
const threatLevel = document.getElementById("threatLevel");
const indicatorList = document.getElementById("indicatorList");
const recommendationText = document.getElementById("recommendationText");

analyzeBtn.addEventListener("click", analyzeThreat);

async function analyzeThreat() {

    const message = messageInput.value.trim();

    if (message === "") {

        threatLevel.innerHTML = "Awaiting analysis...";
        threatLevel.style.color = "#e2e8f0";

        indicatorList.innerHTML =
            "No indicators detected yet.";

        recommendationText.innerHTML =
            "Paste a message and begin analysis.";

        return;
    }

    try {

        threatLevel.innerHTML = "Analyzing...";
        indicatorList.innerHTML = "Checking...";
        recommendationText.innerHTML = "Please wait...";

        const response = await fetch(
            "http://localhost:3000/api/phishing",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
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

                            content:
`Analyze this message for phishing:

${message}`
                        }

                    ]

                })

            }
        );

        const data = await response.json();

        console.log(data);

        if (!data.choices) {

            threatLevel.innerHTML = "Analyze Failed";
            threatLevel.style.color = "#ef4444";

            indicatorList.innerHTML =
                "Groq API returned an error.";

            recommendationText.innerHTML =
                data.error?.message || "Unknown error.";

            return;
        }

        const result =
            data.choices[0].message.content;

        let risk = "Unknown";
        let indicators = "No indicators detected";
        let recommendation = "No recommendation";

        result.split("\n").forEach(line => {

            if (line.startsWith("Risk Level:")) {

                risk =
                    line.replace("Risk Level:", "").trim();

            }

            else if (line.startsWith("Indicators:")) {

                indicators =
                    line.replace("Indicators:", "").trim();

            }

            else if (line.startsWith("Recommendation:")) {

                recommendation =
                    line.replace("Recommendation:", "").trim();

            }

        });

        threatLevel.innerHTML = risk;

        if (risk.toLowerCase().includes("high")) {

            threatLevel.style.color = "#ef4444";

        }

        else if (risk.toLowerCase().includes("moderate")) {

            threatLevel.style.color = "#f59e0b";

        }

        else {

            threatLevel.style.color = "#22c55e";

        }

        indicatorList.innerHTML = indicators;

        recommendationText.innerHTML = recommendation;

        const user = auth.currentUser;

        if (user) {

            await addDoc(
                collection(db, "users", user.uid, "history"),
                {
                    feature: "Phishing Detector",
                    input: message,
                    result: risk,
                    timestamp: new Date()
                }
            );

        }

    }

    catch (error) {

        console.error(error);

        threatLevel.innerHTML = "Analyze Failed";
        threatLevel.style.color = "#ef4444";

        indicatorList.innerHTML = "Request failed.";

        recommendationText.innerHTML = error.message;

    }

}