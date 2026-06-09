const passwordInput = document.getElementById("password");
const togglePassword = document.querySelector(".toggle-password");

togglePassword.addEventListener("click", () => {

    if(passwordInput.type === "password"){
        passwordInput.type = "text";
        togglePassword.textContent = "🙈";
    }
    else{
        passwordInput.type = "password";
        togglePassword.textContent = "👁️";
    }

});

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit",(e)=>{

    e.preventDefault();

    alert("Login feature coming soon ⚡");

});

const tabs = document.querySelectorAll(".tabs button");

tabs.forEach(tab => {

    tab.addEventListener("click",()=>{

        tabs.forEach(btn => btn.classList.remove("active"));

        tab.classList.add("active");

    });

});

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function(e) {

    e.preventDefault();

    // temporary user name
    localStorage.setItem("userName", "Swati");

    window.location.href = "dashboard.html";

});