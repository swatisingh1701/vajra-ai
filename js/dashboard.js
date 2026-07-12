import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    getDocs,
    query,
    orderBy
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    const name = user.displayName || user.email.split("@")[0];

    const hour = new Date().getHours();

    let greeting;

    if (hour < 12) {

        greeting = "Good Morning";

    }

    else if (hour < 17) {

        greeting = "Good Afternoon";

    }

    else if (hour < 21) {

        greeting = "Good Evening";

    }

    else {

        greeting = "Good Night";

    }

    document.getElementById("welcomeText").innerHTML =
        `${greeting}, ${name} 👋`;

    document.querySelector(".avatar").innerHTML =
        name.charAt(0).toUpperCase();

    loadDashboard(user.uid);

});

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});

async function loadDashboard(uid) {

    const q = query(
        collection(db, "users", uid, "history"),
        orderBy("timestamp", "desc")
    );

    const snapshot = await getDocs(q);

    let totalScans = 0;
    let threatsBlocked = 0;
    let safeActivities = 0;

    const activityContainer =
        document.getElementById("recentActivity");

    activityContainer.innerHTML = "";

    if (snapshot.empty) {

        activityContainer.innerHTML =
            `<div class="activity-item">
                No activity yet.
            </div>`;

        document.getElementById("totalScans").innerText = 0;
        document.getElementById("threatsBlocked").innerText = 0;
        document.getElementById("safeActivities").innerText = 0;
        document.getElementById("securityScore").innerText = "0%";

        createChart(0, 0, 0);

        return;
    }

    let count = 0;

    snapshot.forEach((doc) => {

        const data = doc.data();

        totalScans++;

        if (data.result === "High Risk") {

            threatsBlocked++;

        }

        if (data.result === "Safe") {

            safeActivities++;

        }

        if (count < 5) {

            activityContainer.innerHTML += `
                <div class="activity-item">
                    ${data.feature} → ${data.result}
                </div>
            `;

        }

        count++;

    });

    document.getElementById("totalScans").innerText =
        totalScans;

    document.getElementById("threatsBlocked").innerText =
        threatsBlocked;

    document.getElementById("safeActivities").innerText =
        safeActivities;

    const score = totalScans === 0
        ? 0
        : Math.round((safeActivities / totalScans) * 100);

    document.getElementById("securityScore").innerText =
        score + "%";

    createChart(totalScans, threatsBlocked, safeActivities);

}

function createChart(totalScans, threatsBlocked, safeActivities) {

    const ctx = document.getElementById("scanChart");

    new Chart(ctx, {

        type: "bar",

        data: {

            labels: [
                "Total Scans",
                "Threats Blocked",
                "Safe Activities"
            ],

            datasets: [{

                label: "Activity Overview",

                data: [
                    totalScans,
                    threatsBlocked,
                    safeActivities
                ],

                borderWidth: 2

            }]

        },

        options: {

            responsive: true

        }

    });

}



const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileSidebar = document.getElementById("mobileSidebar");
const overlay = document.querySelector(".overlay");
const menuIcon = document.getElementById("menuIcon");

hamburgerBtn.addEventListener("click", () => {

    mobileSidebar.classList.toggle("open");
    overlay.classList.toggle("open");
    hamburgerBtn.classList.toggle("active");

    if(mobileSidebar.classList.contains("open")){

        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-xmark");

    }

    else{

        menuIcon.classList.remove("fa-xmark");
        menuIcon.classList.add("fa-bars");

    }

});

overlay.addEventListener("click",()=>{

    mobileSidebar.classList.remove("open");
    overlay.classList.remove("open");
    hamburgerBtn.classList.remove("active");

    menuIcon.classList.remove("fa-xmark");
    menuIcon.classList.add("fa-bars");

});


// Search bar interactivity

const searchBox = document.getElementById("searchBox");

const featureMap = {

    dashboard:"dashboard.html",

    phishing:"phishing-detector.html",
    phishingdetector:"phishing-detector.html",

    url:"url-scanner.html",
    scanner:"url-scanner.html",

    password:"password-checker.html",
    analyzer:"password-checker.html",
    checker:"password-checker.html",

    generator:"password-generator.html",

    ip:"ip-intelligence.html",
    intelligence:"ip-intelligence.html",

    medha:"medha.html",
    ai:"medha.html",

    history:"history.html",

    settings:"settings.html"

};

searchBox.addEventListener("keydown",(e)=>{

    if(e.key!=="Enter") return;

    const value = searchBox.value
    .trim()
    .toLowerCase();

    let found = false;

for(const key in featureMap){

    if(value.includes(key)){

        window.location.href = featureMap[key];
        found = true;
        break;

    }

}

    if(!found){

        alert("No matching feature found.");

    }

});