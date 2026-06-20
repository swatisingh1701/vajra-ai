import { auth, db } from "./firebase-config.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const buttons = document.querySelectorAll(".setting-btn");
const modal = document.getElementById("settingsModal");
const modalTitle = document.getElementById("modal-title");
const modalContent = document.getElementById("modal-content");
const closeBtn = document.querySelector(".close-modal");

buttons[0].addEventListener("click", () => {

    modalTitle.textContent = "Profile";

    modalContent.innerHTML = `

        <div class="profile-box">

            <label>Name</label>
            <input type="text" id="profileName">

            <label>Email</label>
            <input type="email" id="profileEmail" disabled>

            <label>Gender</label>
            <select id="profileGender">
                <option value="">Select</option>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
            </select>

            <label>Bio</label>
            <textarea id="profileBio"
            placeholder="Tell something about yourself"></textarea>

            <button id="saveProfileBtn">
                Save Changes
            </button>

        </div>

    `;

    modal.style.display = "flex";

    loadProfile();

});


buttons[1].addEventListener("click", () => {

    modalTitle.textContent = "Security";

    modalContent.innerHTML = `
    • API keys are protected using .env<br><br>
    • FastAPI backend enabled<br><br>
    • Secure architecture for AI services
    `;

    modal.style.display = "flex";

});


buttons[2].addEventListener("click", () => {

    modalTitle.textContent = "Notifications";

    modalContent.innerHTML = `
    Dashboard alerts are currently enabled.
    Future versions may include email notifications.
    `;

    modal.style.display = "flex";

});


buttons[3].addEventListener("click", () => {

    window.location.href = "history.html";

});


buttons[4].addEventListener("click", () => {

    modalTitle.textContent = "Help & Support";

    modalContent.innerHTML = `
    Report issues through the GitHub repository.<br><br>
    Developer: Swati Singh
    `;

    modal.style.display = "flex";

});


buttons[5].addEventListener("click", () => {

    modalTitle.textContent = "About Vajra AI";

    modalContent.innerHTML = `
    <strong>Version:</strong> V1<br><br>

    Vajra AI is an AI-powered cybersecurity platform designed to help users detect threats and improve cyber awareness.<br><br>

    <strong>Developer:</strong> Swati Singh<br><br>

    Features:
    • Password Analyzer<br>
    • URL Scanner<br>
    • IP Intelligence<br>
    • MEDHA AI Assistant<br>
    • Activity History<br><br>

    <strong>Tagline:</strong><br>
    Detect. Defend. Dominate.
    `;

    modal.style.display = "flex";

});


closeBtn.addEventListener("click", () => {

    modal.style.display = "none";

});


window.addEventListener("click", (event) => {

    if (event.target === modal) {

        modal.style.display = "none";

    }

});

async function loadProfile() {

    const user = auth.currentUser;

    if (!user) return;

    document.getElementById("profileEmail").value =
        user.email;

    const ref = doc(db, "users", user.uid);

    const snap = await getDoc(ref);

    if (snap.exists()) {

        const data = snap.data();

        document.getElementById("profileName").value =
            data.name || "";

        document.getElementById("profileGender").value =
            data.gender || "";

        document.getElementById("profileBio").value =
            data.bio || "";

    }

    document
        .getElementById("saveProfileBtn")
        .addEventListener("click", saveProfile);

}


async function saveProfile() {

    const user = auth.currentUser;

    if (!user) return;

    await setDoc(

        doc(db, "users", user.uid),

        {

            name:
                document.getElementById("profileName").value,

            gender:
                document.getElementById("profileGender").value,

            bio:
                document.getElementById("profileBio").value,

            email: user.email

        },

        { merge: true }

    );

    alert("Profile updated successfully.");

}