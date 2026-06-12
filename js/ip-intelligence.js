const API_KEY = "TO USE THE FEATURE ENTER API KEY FROM IPINFO"; 
const lookupBtn = document.getElementById("lookupBtn");
const ipInput = document.getElementById("ipInput");

const country = document.getElementById("country");
const region = document.getElementById("region");
const city = document.getElementById("city");
const org = document.getElementById("org");
const timezone = document.getElementById("timezone");
const version = document.getElementById("version");

lookupBtn.addEventListener("click", lookupIP);

async function lookupIP() {

    const ip = ipInput.value.trim();

    // Empty input
    if (ip === "") {

        resetFields();

        country.textContent = "Please enter an IP address.";
        return;
    }

    try {

        // Loading state
        country.textContent = "Loading...";
        region.textContent = "Loading...";
        city.textContent = "Loading...";
        org.textContent = "Loading...";
        timezone.textContent = "Loading...";
        version.textContent = "Loading...";

        const response = await fetch(
            `https://ipinfo.io/${ip}/json?token=${API_KEY}`
        );

        const data = await response.json();

        // Invalid IP
        if (data.status === 404 || data.error) {

            resetFields();

            country.textContent = "Invalid IP address";
            return;
        }

        country.textContent = data.country || "Unavailable";

        region.textContent = data.region || "Unavailable";

        city.textContent = data.city || "Unavailable";

        org.textContent = data.org || "Unavailable";

        timezone.textContent = data.timezone || "Unavailable";

        // Detect IPv4 vs IPv6
        if (ip.includes(":")) {

            version.textContent = "IPv6";

        } else {

            version.textContent = "IPv4";

        }

    }

    catch (error) {

        resetFields();

        country.textContent = "Lookup failed";
        console.error(error);

    }

}


function resetFields() {

    country.textContent = "Awaiting lookup...";
    region.textContent = "Awaiting lookup...";
    city.textContent = "Awaiting lookup...";
    org.textContent = "Awaiting lookup...";
    timezone.textContent = "Awaiting lookup...";
    version.textContent = "Awaiting lookup...";

}