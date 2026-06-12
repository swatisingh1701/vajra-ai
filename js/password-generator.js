const generatedPassword = document.getElementById("generatedPassword");

const copyBtn = document.getElementById("copyBtn");
const generateBtn = document.getElementById("generateBtn");

const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");

const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");

const recommendationCard = document.querySelector(".recommendation-card p");


// Character Sets
const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerChars = "abcdefghijklmnopqrstuvwxyz";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+-={}[]<>?/";

// Slider Update
lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = `${lengthSlider.value} Characters`;
});

// Generate Button
generateBtn.addEventListener("click", generatePassword);

// Copy Button
copyBtn.addEventListener("click", copyPassword);


// Generate Password
function generatePassword() {

    // Prevent all unchecked
    if (
        !uppercase.checked &&
        !lowercase.checked &&
        !numbers.checked &&
        !symbols.checked
    ) {

        alert("Select at least one character type.");
        return;
    }

    let charset = "";

    if (uppercase.checked) charset += upperChars;
    if (lowercase.checked) charset += lowerChars;
    if (numbers.checked) charset += numberChars;
    if (symbols.checked) charset += symbolChars;

    let password = "";

    const length = parseInt(lengthSlider.value);

    for (let i = 0; i < length; i++) {

        const randomIndex = Math.floor(Math.random() * charset.length);

        password += charset[randomIndex];
    }

    generatedPassword.value = password;

    updateRecommendation(length);
}


// Copy Password
function copyPassword() {

    if (generatedPassword.value === "") return;

    navigator.clipboard.writeText(generatedPassword.value);

    copyBtn.innerHTML = `
        <i class="fa-solid fa-check"></i>
        Copied
    `;

    setTimeout(() => {

        copyBtn.innerHTML = `
            <i class="fa-regular fa-copy"></i>
            Copy
        `;

    }, 2000);
}


// Strength Recommendation
function updateRecommendation(length) {

    if (length < 12) {

        recommendationCard.innerHTML =
            "Short passwords are easier to crack. Consider using at least 12 characters for stronger protection.";

        recommendationCard.style.color = "#ef4444";
    }

    else if (length < 16) {

        recommendationCard.innerHTML =
            "Moderate security. Adding more characters improves resistance against brute-force attacks.";

        recommendationCard.style.color = "#f59e0b";
    }

    else {

        recommendationCard.innerHTML =
            "Excellent security. Long passwords with mixed character types provide stronger protection.";

        recommendationCard.style.color = "#22c55e";
    }

}


// Generate one password automatically on page load
generatePassword();