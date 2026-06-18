import { auth, db } from "./firebase-config.js";

import {
    collection,
    addDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const API_KEY = "";

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

    if (ip === "") {

        resetFields();

        country.textContent = "Please enter an IP address.";

        return;
    }

    try {

        country.textContent = "Loading...";
        region.textContent = "Loading...";
        city.textContent = "Loading...";
        org.textContent = "Loading...";
        timezone.textContent = "Loading...";
        version.textContent = "Loading...";

        const response = await fetch(
            `http://localhost:3000/api/iplookup/${ip}`
        );

        const data = await response.json();

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

        let ipVersion = "IPv4";

        if (ip.includes(":")) {

            ipVersion = "IPv6";

        }

        version.textContent = ipVersion;

        // SAVE TO FIRESTORE
        const user = auth.currentUser;

        if (user) {

            await addDoc(
                collection(db, "users", user.uid, "history"),
                {
                    feature: "IP Intelligence",
                    input: ip,
                    result: `${data.country} | ${data.city}`,
                    timestamp: new Date()
                }
            );

            console.log("IP lookup saved");

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