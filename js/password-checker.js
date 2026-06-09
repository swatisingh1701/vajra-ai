// Password Strength Analyzer - Vajra AI
// Improved JavaScript logic with all requirements

const passwordInput = document.getElementById("passwordInput");
const strengthText = document.getElementById("strengthText");
const progressBar = document.getElementById("progressBar");
const togglePassword = document.getElementById("togglePassword");
const securityTip = document.id = document.getElementById("getsecurityTip"); // Added for security tips if exists, or create it

// Initialize
passwordInput.addEventListener("input", analyzePassword);
togglePassword.addEventListener("click", togglePasswordVisibility);

// Show/hide password toggle
function togglePasswordVisibility() {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");
    }
}

// Main password analysis function
function analyzePassword() {
    const password = passwordInput.value;
    
    // Handle empty input
    if (password.trim() === "") {
        strengthText.innerHTML = "Waiting for analysis...";
        progressBar.style.width = "0%";
        progressBar.style.background = "#d1d5db";
        if (securityTip) securityTip.innerHTML = "Enter a password to begin analysis.";
        
        // Reset all requirement checks
        resetRequirements();
        return;
    }
    
    let score = 0;
    const tips = [];
    
    // ========== CHARACTER REQUIREMENTS ==========
    const hasLength8 = password.length >= 8;
    const hasLength12 = password.length >= 12;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>[\]\\-_=+]/.test(password);
    
    // Score for character types
    if (hasLength8) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    
    // ========== PENALTY: Short password ==========
    if (password.length < 12) {
        score -= 1;
        tips.push("Use at least 12 characters for better security.");
    }
    
    // ========== DETECT COMMON PASSWORDS ==========
    const commonPasswords = [
        "password", "admin", "qwerty", "welcome", "123456", "12345678",
        "iloveyou", "love", "root", "pass", "test", "guest", "master",
        "password1", "admin123", "letmein"
    ];
    
    const lowerPassword = password.toLowerCase();
    for (let common of commonPasswords) {
        if (lowerPassword.includes(common)) {
            score -= 2;
            tips.push("Avoid common passwords like \"" + common + "\".");
            break;
        }
    }
    
    // ========== DETECT SEQUENCES ==========
    const sequences = [
        "12345", "1234", "123456", "1234567", "12345678",
        "abcdef", "abcdefg", "abcdefgh",
        "qwerty", "qwertyui", "qwer"
    ];
    
    for (let seq of sequences) {
        if (lowerPassword.includes(seq)) {
            score -= 1;
            tips.push("Avoid sequential patterns like \"" + seq + "\".");
            break;
        }
    }
    
    // ========== DETECT YEARS (2005, 2007, 2010) ==========
    const yearPattern = /(200[5-9]|201[0-9]|202[0-9]|199[5-9])/;
    if (yearPattern.test(password)) {
        score -= 1;
        tips.push("Avoid using years like 2005, 2007, 2010 in your password.");
    }
    
    // ========== DETECT PERSONAL INFORMATION (Names) ==========
    const onlyNamePattern = /^[a-zA-Z]{3,12}[0-9]{1,4}$/;
    if (onlyNamePattern.test(password)) {
        score -= 1;
        tips.push("Avoid using just your name with numbers. Mix in more character types.");
    }
    
    // ========== DETECT BIRTHDAY PATTERNS ==========
    const birthdayPattern = /(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[0-9]{2}/;
    if (birthdayPattern.test(password)) {
        score -= 1;
        tips.push("Avoid using dates or birthdays in your password.");
    }
    
    // ========== PREVENT NEGATIVE SCORE ==========
    if (score < 0) score = 0;
    
    // ========== ADD SCORE FOR GOOD PRACTICES ==========
    const charTypes = hasUpper + hasLower + hasNumber + hasSpecial;
    if (charTypes >= 3 && score > 0) score++;
    if (hasLength12 && charTypes >= 3) score++;
    
    // ========== DETERMINE STRENGTH ==========
    let strength, progressWidth, progressColor, tipMessage;
    
    if (score <= 2) {
        strength = "Weak 🔴";
        progressWidth = "30%";
        progressColor = "#ef4444";
        tipMessage = "Your password is too weak. Add more character types and avoid common patterns.";
    } else if (score <= 4) {
        strength = "Moderate 🟡";
        progressWidth = "65%";
        progressColor = "#f59e0b";
        tipMessage = "Your password is moderately secure. Add more complexity and length.";
    } else {
        strength = "Strong 🟢";
        progressWidth = "100%";
        progressColor = "#22c55e";
        tipMessage = "Excellent! Your password follows strong security practices.";
    }
    
    // ========== UPDATE UI ==========
    strengthText.innerHTML = strength;
    progressBar.style.width = progressWidth;
    progressBar.style.background = progressColor;
    
    // ========== GENERATE USER-FRIENDLY TIPS ==========
    if (tips.length === 0 && score > 4) {
        tips.push("Great password! Consider using a password manager.");
    } else if (tips.length === 0) {
        tips.push("Your password meets requirements. Add more length for better security.");
    }
    
    if (password.length < 12 && !tips.some(t => t.includes("12 characters"))) {
        tips.push("Use at least 12 characters for better security.");
    }
    
    if (charTypes < 3 && !tips.some(t => t.includes("character types"))) {
        tips.push("Mix uppercase, lowercase, numbers, and special characters.");
    }
    
    if (!tips.some(t => t.includes("common"))) {
        tips.push("Avoid common words and predictable patterns.");
    }
    
    tipMessage += "<br><br><strong>Tips:</strong><br>" + 
                  tips.slice(0, 3).map(t => "✓ " + t).join("<br>");
    
    if (securityTip) securityTip.innerHTML = tipMessage;
    
    // ========== UPDATE REQUIREMENT CHECKS ==========
    updateRequirements(hasLength8, hasUpper, hasLower, hasNumber, hasSpecial, score);
}

// Reset all requirement checks
function resetRequirements() {
    setRequirement("lengthCheck", false);
    setRequirement("upperCheck", false);
    setRequirement("numberCheck", false);
    setRequirement("specialCheck", false);
}

// Update requirement checks based on password
function updateRequirements(hasLength, hasUpper, hasLower, hasNumber, hasSpecial, score) {
    setRequirement("lengthCheck", hasLength);
    setRequirement("upperCheck", hasUpper);
    setRequirement("numberCheck", hasNumber);
    setRequirement("specialCheck", hasSpecial);
}

// Helper to set individual requirement
function setRequirement(id, passed) {

    const element = document.getElementById(id);

    if (!element) return;

    // Original text without symbols
    const texts = {
        lengthCheck: "Minimum 8 characters",
        upperCheck: "At least one uppercase letter",
        numberCheck: "At least one number",
        specialCheck: "At least one special character"
    };

    if (passed) {

        element.innerHTML = "✓ " + texts[id];
        element.style.color = "#22c55e";

    } else {

        element.innerHTML = "✕ " + texts[id];
        element.style.color = "#94A3B8";

    }

}