import { auth } from "./firebase-config.js";
import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const ctx = document.getElementById("scanChart");

new Chart(ctx, {
    type: "line",
    data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        datasets: [{
            label: "Scans",
            data: [12, 19, 3, 5, 2, 8],
            borderWidth: 2,
            tension: 0.4
        }]
    },
    options: {
        responsive: true
    }
});

onAuthStateChanged(auth, (user) => {

    if (user) {

        const name = user.displayName || user.email.split("@")[0];

        document.getElementById("welcomeText").innerHTML =
            `Good Evening, ${name} 👋`;

        document.querySelector(".avatar").innerHTML =
            name.charAt(0).toUpperCase();

    }

    else {

        window.location.href = "login.html";

    }

});

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});