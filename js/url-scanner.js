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
    indicatorList.innerHTML = "No indicators detected yet.";
    recommendationText.innerHTML = "Enter a URL and begin scanning.";
    return;
  }

  try {
    scanResult.innerHTML = "Scanning...";
    scanResult.className = "";
    indicatorList.innerHTML = "Checking with VirusTotal and heuristics...";
    recommendationText.innerHTML = "Please wait...";

    let heuristicScore = 0;
    let detectedIndicators = [];
    const lowerURL = url.toLowerCase();

    if (!lowerURL.startsWith("https://")) {
      heuristicScore++;
      detectedIndicators.push("Non-secure HTTP protocol detected");
    }

    const ipPattern = /\d+\.\d+\.\d+\.\d+/;
    if (ipPattern.test(lowerURL)) {
      heuristicScore++;
      detectedIndicators.push("IP address detected in URL");
    }

    const shorteners = ["bit.ly", "tinyurl", "goo.gl", "t.co", "rebrand.ly"];
    for (let service of shorteners) {
      if (lowerURL.includes(service)) {
        heuristicScore++;
        detectedIndicators.push("Shortened URL detected");
        break;
      }
    }

    const suspiciousWords = [
      "login", "verify", "secure", "bank", "paypal", "account",
      "signin", "update", "wallet", "gift", "reward", "otp",
      "kyc", "free", "bonus", "refund", "invoice", "payment"
    ];
    for (let word of suspiciousWords) {
      if (lowerURL.includes(word)) {
        heuristicScore++;
        detectedIndicators.push(`Suspicious keyword: ${word}`);
      }
    }

    const hyphenCount = (lowerURL.match(/-/g) || []).length;
    if (hyphenCount >= 3) {
      heuristicScore++;
      detectedIndicators.push("Multiple hyphens detected");
    }

    let heuristicRisk = "Safe";
    if (heuristicScore >= 5) heuristicRisk = "High Risk";
    else if (heuristicScore >= 2) heuristicRisk = "Moderate Risk";

    let virusTotalRisk = "Safe";
    let malicious = 0;
    let suspicious = 0;
    let virusTotalFailed = false;

    try {
      const submitResponse = await fetch(
        "https://vajra-ai-backend.onrender.com/api/urlScanner",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ url })
        }
      );

      const submitData = await submitResponse.json();

      if (submitData.error) {
        throw new Error(submitData.error);
      }

      malicious = submitData.malicious;
      suspicious = submitData.suspicious;

      if (malicious > 0) virusTotalRisk = "High Risk";
      else if (suspicious > 0) virusTotalRisk = "Moderate Risk";
    } catch (virustotalError) {
      console.error("VirusTotal API error:", virustotalError);
      virusTotalFailed = true;
    }

    let finalResult = "";
    if (virusTotalRisk === "High Risk" || heuristicRisk === "High Risk") {
      finalResult = "High Risk";
      scanResult.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> High Risk';
      scanResult.className = "danger-result";
    } else if (virusTotalRisk === "Moderate Risk" || heuristicRisk === "Moderate Risk") {
      finalResult = "Moderate Risk";
      scanResult.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Moderate Risk';
      scanResult.className = "moderate-result";
    } else {
      finalResult = "Safe";
      scanResult.innerHTML = '<i class="fa-solid fa-circle-check"></i> Safe';
      scanResult.className = "safe-result";
    }

    let indicatorsHTML = "";
    if (virusTotalFailed) {
      indicatorsHTML += `<div class="indicator danger">VirusTotal API failed - heuristics only</div>`;
    }
    if (malicious > 0) {
      indicatorsHTML += `<div class="indicator danger">${malicious} security engines flagged this URL (VirusTotal)</div>`;
    }
    if (suspicious > 0) {
      indicatorsHTML += `<div class="indicator warning">${suspicious} engines marked this URL as suspicious (VirusTotal)</div>`;
    }
    if (virusTotalRisk === "Safe" && !virusTotalFailed && heuristicScore === 0) {
      indicatorsHTML += `<div class="indicator success">No threats detected by VirusTotal</div>`;
    }

    for (let indicator of detectedIndicators) {
      if (heuristicRisk === "High Risk") {
        indicatorsHTML += `<div class="indicator danger">${indicator}</div>`;
      } else if (heuristicRisk === "Moderate Risk") {
        indicatorsHTML += `<div class="indicator warning">${indicator}</div>`;
      } else {
        indicatorsHTML += `<div class="indicator success">${indicator}</div>`;
      }
    }

    if (indicatorsHTML === "") indicatorsHTML = "No indicators detected.";
    indicatorList.innerHTML = indicatorsHTML;

    if (finalResult === "High Risk") {
      recommendationText.innerHTML = "Avoid opening this link. It shows multiple signs of being dangerous.";
    } else if (finalResult === "Moderate Risk") {
      recommendationText.innerHTML = "Proceed carefully. Verify the source before clicking.";
    } else {
      recommendationText.innerHTML = "No known threats detected. The URL appears safe.";
    }

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
  } catch (error) {
    console.error(error);
    scanResult.innerHTML = "Scan Failed";
    scanResult.className = "danger-result";
    indicatorList.innerHTML = "An error occurred during scanning.";
    recommendationText.innerHTML = error.message;
  }
}