// Theme buttons
const darkBtn = document.getElementById("dark-mode");
const lightBtn = document.getElementById("light-mode");

darkBtn.addEventListener("click", () => {

    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");

});

lightBtn.addEventListener("click", () => {

    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");

});


// Accent Colors
const colorCircles = document.querySelectorAll(".color-option");

colorCircles.forEach(circle => {

    circle.addEventListener("click", () => {

        colorCircles.forEach(c =>
            c.classList.remove("active-color")
        );

        circle.classList.add("active-color");

    });

});


// Copy API Key
const copyBtn = document.getElementById("copy-key");

if (copyBtn) {

    copyBtn.addEventListener("click", () => {

        navigator.clipboard.writeText(
            "************abcd"
        );

        alert("API key copied.");

    });

}


// Edit Profile
const editProfile = document.getElementById("edit-profile");

if (editProfile) {

    editProfile.addEventListener("click", () => {

        alert("Profile editing will be added later.");

    });

}


// Change Password
const changePassword = document.getElementById("change-password");

if (changePassword) {

    changePassword.addEventListener("click", () => {

        alert("Password change feature will be added later.");

    });

}


// Two Factor Authentication
const twoFactor = document.getElementById("two-factor");

if (twoFactor) {

    twoFactor.addEventListener("click", () => {

        alert("2FA support will be added later.");

    });

}


// Sign Out
const signOutBtn = document.getElementById("sign-out");

if (signOutBtn) {

    signOutBtn.addEventListener("click", () => {

        if (confirm("Sign out from Vajra AI?")) {

            window.location.href = "../index.html";

        }

    });

}


// Delete Account
const deleteBtn = document.getElementById("delete-account");

if (deleteBtn) {

    deleteBtn.addEventListener("click", () => {

        const choice = confirm(
            "This action cannot be undone. Continue?"
        );

        if (choice) {

            alert("Account deletion backend not connected yet.");

        }

    });

}