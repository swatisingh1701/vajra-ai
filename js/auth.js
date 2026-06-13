import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


// =====================
// ELEMENTS
// =====================

const loginForm = document.getElementById("login-form");

const loginBtn = document.querySelector(".login-btn");

const googleBtn = document.querySelector(".google-btn");

const signupTab = document.getElementById("signupTab");

const loginTab = document.getElementById("loginTab");


// =====================
// MODE SWITCH
// =====================

let isSignupMode = false;

signupTab.addEventListener("click", () => {

    isSignupMode = true;

    signupTab.classList.add("active");
    loginTab.classList.remove("active");

    loginBtn.innerText = "Create Account";

});

loginTab.addEventListener("click", () => {

    isSignupMode = false;

    loginTab.classList.add("active");
    signupTab.classList.remove("active");

    loginBtn.innerText = "Login";

});


// =====================
// LOGIN / SIGNUP FORM
// =====================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    try {

        if (isSignupMode) {

            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            alert("Account created successfully!");

        }

        else {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        }

        window.location.href = "dashboard.html";

    }

    catch (error) {

        alert(error.message);

    }

});


// =====================
// GOOGLE LOGIN
// =====================

googleBtn.addEventListener("click", async () => {

    try {

        const provider = new GoogleAuthProvider();

        await signInWithPopup(auth, provider);

        window.location.href = "dashboard.html";

    }

    catch (error) {

        alert(error.message);

    }

});