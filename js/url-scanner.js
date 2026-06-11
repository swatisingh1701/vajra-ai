const scanBtn = document.getElementById("scanBtn");
const urlInput = document.getElementById("urlInput");
const scanResult = document.getElementById("riskLevel");
const indicatorList = document.getElementById("indicatorList");
const recommendationText = document.getElementById("recommendationText");

scanBtn.addEventListener("click", scanURL);

function scanURL() {

    const url = urlInput.value.trim();

    // Empty input
    if (url === "") {

        scanResult.innerHTML = "Awaiting analysis...";
        scanResult.className = "";

        indicatorList.innerHTML =
            "No indicators detected yet.";

        recommendationText.innerHTML =
            "Enter a URL and begin scanning.";

        return;
    }

    const lowerURL = url.toLowerCase();

    let indicators = [];
    let riskScore = 0;

    // HTTPS Check
    if (lowerURL.startsWith("https://")) {

        indicators.push(`
            <div class="indicator success">
                Secure HTTPS protocol detected
            </div>
        `);

    } else {

        indicators.push(`
            <div class="indicator danger">
                Non-secure HTTP protocol detected
            </div>
        `);

        riskScore++;
    }

    // IP Address Detection
    const ipPattern = /\d+\.\d+\.\d+\.\d+/;

    if (ipPattern.test(lowerURL)) {

        indicators.push(`
            <div class="indicator danger">
                IP address detected in URL
            </div>
        `);

        riskScore++;
    }

    // Shortened URLs
    const shorteners = [
        "bit.ly",
        "tinyurl",
        "goo.gl",
        "t.co",
        "rebrand.ly"
    ];

    for (let service of shorteners) {

        if (lowerURL.includes(service)) {

            indicators.push(`
                <div class="indicator warning">
                    Shortened URL detected
                </div>
            `);

            riskScore++;
            break;
        }
    }

    // Suspicious Keywords
    const suspiciousWords = [
        "login",
        "verify",
        "secure",
        "bank",
        "paypal",
        "update",
        "account",
        "confirm",
        "signin"
    ];

    for (let word of suspiciousWords) {

        if (lowerURL.includes(word)) {

            indicators.push(`
                <div class="indicator warning">
                    Suspicious keyword detected: ${word}
                </div>
            `);

            riskScore++;
        }
    }

    // Hyphens
    const hyphenCount = (lowerURL.match(/-/g) || []).length;

    if (hyphenCount >= 3) {

        indicators.push(`
            <div class="indicator warning">
                Multiple hyphens detected
            </div>
        `);

        riskScore++;
    }

    // Show indicators
    indicatorList.innerHTML = indicators.join("");

    // Risk Result
    if (riskScore <= 1) {

        scanResult.innerHTML =
            '<i class="fa-solid fa-circle-check"></i> Safe';

        scanResult.className = "safe-result";

        recommendationText.innerHTML =
            "No major risks detected. Proceed normally.";

    }

    else if (riskScore <= 3) {

        scanResult.innerHTML =
            '<i class="fa-solid fa-triangle-exclamation"></i> Moderate Risk';

        scanResult.className = "moderate-result";

        recommendationText.innerHTML =
            "Verify the destination before interacting with this link.";

    }

    else {

        scanResult.innerHTML =
            '<i class="fa-solid fa-circle-xmark"></i> High Risk';

        scanResult.className = "danger-result";

        recommendationText.innerHTML =
            "Avoid opening this link unless its legitimacy is confirmed.";

    }

}