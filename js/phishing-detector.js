const analyzeBtn = document.getElementById("analyzeBtn");
const messageInput = document.getElementById("messageInput");
const threatLevel = document.getElementById("threatLevel");
const indicatorList = document.getElementById("indicatorList");
const recommendationText = document.getElementById("recommendationText");

const phishingKeywords = [
    "urgent",
    "click here",
    "verify account",
    "password",
    "bank account",
    "otp",
    "limited time",
    "winner",
    "claim reward",
    "gift card",
    "security alert",
    "account suspended",
    "login immediately",
    "update payment",
    "confirm identity",
    "verify your account",
    "reset password",
    "suspended",
    "act now",
    "immediately"
];

analyzeBtn.addEventListener("click", analyzeThreat);

function analyzeThreat() {

    const message = messageInput.value.trim();

    // Empty input
    if (message === "") {

        threatLevel.innerHTML = "Awaiting analysis...";
        threatLevel.style.color = "#e2e8f0";

        indicatorList.innerHTML =
            "No indicators detected yet.";

        recommendationText.innerHTML =
            "Paste a message and begin analysis.";

        return;
    }

    const lowerMessage = message.toLowerCase();

    let detectedIndicators = [];
    let riskScore = 0;

    // Keyword Detection
    for (let word of phishingKeywords) {

        if (lowerMessage.includes(word)) {

            detectedIndicators.push(word);
            riskScore++;

        }
    }

    // URL Detection
    if (
        lowerMessage.includes("http://") ||
        lowerMessage.includes("https://") ||
        lowerMessage.includes("www.")
    ) {

        detectedIndicators.push("External link detected");
        riskScore++;

    }

    // Excessive Exclamation Marks
    const exclamationCount = (message.match(/!/g) || []).length;

    if (exclamationCount >= 3) {

        detectedIndicators.push("Excessive punctuation detected");
        riskScore++;

    }

    // ALL CAPS Detection
    if (
        message === message.toUpperCase() &&
        message.length > 15
    ) {

        detectedIndicators.push("Aggressive formatting detected");
        riskScore++;

    }

    // Show indicators
    if (detectedIndicators.length === 0) {

        indicatorList.innerHTML =
            "No suspicious indicators detected.";

    } else {

        indicatorList.innerHTML =
            detectedIndicators.join("<br>");

    }

    // Risk Level
    if (riskScore === 0) {

        threatLevel.innerHTML = "Low Risk";
        threatLevel.style.color = "#22c55e";

        recommendationText.innerHTML =
            "No major phishing indicators were detected.";

    }

    else if (riskScore <= 3) {

        threatLevel.innerHTML = "Moderate Risk";
        threatLevel.style.color = "#f59e0b";

        recommendationText.innerHTML =
            "Proceed carefully and verify the sender independently.";

    }

    else {

        threatLevel.innerHTML = "High Risk";
        threatLevel.style.color = "#ef4444";

        recommendationText.innerHTML =
            "Avoid interacting with this message. Do not click links or share credentials.";

    }

}