const API_KEY = "";


import { auth, db } from "./firebase-config.js";


import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const scanBtn = document.getElementById("scanBtn");
const urlInput = document.getElementById("urlInput");
const scanResult = document.getElementById("riskLevel");
const indicatorList = document.getElementById("indicatorList");
const recommendationText = document.getElementById("recommendationText");


scanBtn.addEventListener("click", scanURL);


async function scanURL() {


    const url = urlInput.value.trim();


    if (url === "") {


        scanResult.innerHTML = "Awaiting analysis...";
        scanResult.className = "";


        indicatorList.innerHTML =
            "No indicators detected yet.";


        recommendationText.innerHTML =
            "Enter a URL and begin scanning.";


        return;
    }


    try {


        scanResult.innerHTML = "Scanning...";
        scanResult.className = "";
        indicatorList.innerHTML = "Checking with VirusTotal and heuristics...";
        recommendationText.innerHTML = "Please wait...";


        // ================= HEURISTIC CHECKS =================


        let heuristicScore = 0;
        let detectedIndicators = [];


        const lowerURL = url.toLowerCase();


        // HTTPS check
        if (!lowerURL.startsWith("https://")) {


            heuristicScore++;
            detectedIndicators.push("Non-secure HTTP protocol detected");


        }


        // IP address check
        const ipPattern = /\d+\.\d+\.\d+\.\d+/;


        if (ipPattern.test(lowerURL)) {


            heuristicScore++;
            detectedIndicators.push("IP address detected in URL");


        }


        // Shorteners
        const shorteners = [
            "bit.ly",
            "tinyurl",
            "goo.gl",
            "t.co",
            "rebrand.ly"
        ];


        for (let service of shorteners) {


            if (lowerURL.includes(service)) {


                heuristicScore++;
                detectedIndicators.push("Shortened URL detected");
                break;


            }


        }


        // Suspicious words (updated list)
        const suspiciousWords = [
            "login",
            "verify",
            "secure",
            "bank",
            "paypal",
            "account",
            "signin",
            "update",
            "wallet",
            "gift",
            "reward",
            "otp",
            "kyc",
            "free",
            "bonus",
            "refund",
            "invoice",
            "payment"
        ];


        for (let word of suspiciousWords) {


            if (lowerURL.includes(word)) {


                heuristicScore++;
                detectedIndicators.push(`Suspicious keyword: ${word}`);


            }


        }


        // Hyphen check
        const hyphenCount = (lowerURL.match(/-/g) || []).length;


        if (hyphenCount >= 3) {


            heuristicScore++;
            detectedIndicators.push("Multiple hyphens detected");


        }


        let heuristicRisk = "Safe";


        if (heuristicScore >= 5) {


            heuristicRisk = "High Risk";


        }


        else if (heuristicScore >= 2) {


            heuristicRisk = "Moderate Risk";


        }


        // Submit URL to VirusTotal
        let virusTotalRisk = "Safe";
        let malicious = 0;
        let suspicious = 0;
        let virusTotalFailed = false;


        try {


            const submitResponse = await fetch(
                "https://www.virustotal.com/api/v3/urls",
                {
                    method: "POST",


                    headers: {
                        "x-apikey": API_KEY,
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },


                    body: `url=${encodeURIComponent(url)}`
                }
            );


            const submitData = await submitResponse.json();


            if (!submitData.data) {
                throw new Error("VirusTotal submission failed.");
            }

            const analysisId = submitData.data.id;


            // Wait a little
            await new Promise(resolve => setTimeout(resolve, 3000));


            // Get analysis
            const resultResponse = await fetch(


                `https://www.virustotal.com/api/v3/analyses/${analysisId}`,


                {


                    headers: {
                        "x-apikey": API_KEY
                    }


                }
            );


            const resultData = await resultResponse.json();


            console.log(resultData);


            const stats = resultData?.data?.attributes?.stats;

            if (!stats) {
                throw new Error("VirusTotal analysis unavailable.");
            }


            malicious = stats.malicious;
            suspicious = stats.suspicious;


            // Determine VirusTotal risk
            if (malicious > 0) {


                virusTotalRisk = "High Risk";


            }


            else if (suspicious > 0) {


                virusTotalRisk = "Moderate Risk";


            }


            else {


                virusTotalRisk = "Safe";


            }


        }


        catch (virustotalError) {


            console.error("VirusTotal API error:", virustotalError);
            virusTotalFailed = true;
            // Continue with heuristic results only


        }


        // ================= COMBINE BOTH SYSTEMS =================


        // Risk combination logic:
        // If VirusTotal OR heuristics say High Risk → High Risk
        // If VirusTotal OR heuristics say Moderate Risk → Moderate Risk
        // Otherwise Safe


        let finalResult = "";


        if (virusTotalRisk === "High Risk" || heuristicRisk === "High Risk") {


            finalResult = "High Risk";


            scanResult.innerHTML =
                '<i class="fa-solid fa-circle-xmark"></i> High Risk';


            scanResult.className = "danger-result";


        }


        else if (virusTotalRisk === "Moderate Risk" || heuristicRisk === "Moderate Risk") {


            finalResult = "Moderate Risk";


            scanResult.innerHTML =
                '<i class="fa-solid fa-triangle-exclamation"></i> Moderate Risk';


            scanResult.className = "moderate-result";


        }


        else {


            finalResult = "Safe";


            scanResult.innerHTML =
                '<i class="fa-solid fa-circle-check"></i> Safe';


            scanResult.className = "safe-result";


        }


        // Show ALL detected indicators in indicatorList
        let indicatorsHTML = "";


        // Add VirusTotal indicators
        if (virusTotalFailed) {


            indicatorsHTML += `
                <div class="indicator danger">
                    VirusTotal API failed - heuristics only
                </div>
            `;


        }


        if (malicious > 0) {


            indicatorsHTML += `
                <div class="indicator danger">
                    ${malicious} security engines flagged this URL (VirusTotal)
                </div>
            `;


        }


        if (suspicious > 0) {


            indicatorsHTML += `
                <div class="indicator warning">
                    ${suspicious} engines marked this URL as suspicious (VirusTotal)
                </div>
            `;


        }


        if (virusTotalRisk === "Safe" && !virusTotalFailed && heuristicScore === 0) {


            indicatorsHTML += `
                <div class="indicator success">
                    No threats detected by VirusTotal
                </div>
            `;


        }


        // Add heuristic indicators
        for (let indicator of detectedIndicators) {


            if (heuristicRisk === "High Risk") {


                indicatorsHTML += `
                    <div class="indicator danger">
                        ${indicator}
                    </div>
                `;


            }


            else if (heuristicRisk === "Moderate Risk") {


                indicatorsHTML += `
                    <div class="indicator warning">
                        ${indicator}
                    </div>
                `;


            }


            else {


                indicatorsHTML += `
                    <div class="indicator success">
                        ${indicator}
                    </div>
                `;


            }


        }


        if (indicatorsHTML === "") {


            indicatorsHTML = "No indicators detected.";


        }


        indicatorList.innerHTML = indicatorsHTML;


        // Set recommendation based on final result
        if (finalResult === "High Risk") {


            recommendationText.innerHTML =
                "Avoid opening this link. It shows multiple signs of being dangerous.";


        }


        else if (finalResult === "Moderate Risk") {


            recommendationText.innerHTML =
                "Proceed carefully. Verify the source before clicking.";


        }


        else {


            recommendationText.innerHTML =
                "No known threats detected. The URL appears safe.";


        }


        // Save history to Firestore (unchanged)
        const user = auth.currentUser;


        if (user) {


            await addDoc(
                collection(db, "users", user.uid, "history"),
                {
                    feature: "URL Scanner",
                    input: url,
                    result: finalResult,
                    timestamp: new Date()
                }
            );


        }


    }


    catch (error) {


        console.error(error);
        scanResult.innerHTML = "Scan Failed";
        scanResult.className = "danger-result";


        indicatorList.innerHTML =
            "An error occurred during scanning.";


        recommendationText.innerHTML =
            error.message;


    }


}