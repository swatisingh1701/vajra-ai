// Basic functioning

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const voiceBtn = document.getElementById("voice-btn");
const voiceStatus = document.getElementById("voice-status");

function addMessage(message, sender) {

    const msgDiv = document.createElement("div");

    msgDiv.className =
        sender === "user"
        ? "user-message"
        : "bot-message";

    msgDiv.textContent = message;

    chatBox.appendChild(msgDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}



// Send Button functioning

sendBtn.addEventListener("click", sendMessage);

async function sendMessage() {

    const message = userInput.value.trim();

    if (!message) return;

    addMessage(message, "user");

    userInput.value = "";

    const loadingDiv = document.createElement("div");

    loadingDiv.className = "bot-message";

    loadingDiv.textContent = "MEDHA is thinking...";

    chatBox.appendChild(loadingDiv);

    try {

        const response = await fetch("http://127.0.0.1:8000/api/medha", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });

        const data = await response.json();

        loadingDiv.remove();

        addMessage(data.reply, "bot");

        speak(data.reply);

    }

    catch (error) {

        addMessage(
            "Unable to connect with MEDHA AI.",
            "bot"
        );

    }

}

userInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        sendMessage();

    }

});


// Speech Function

function speak(text) {

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.pitch = 1.2;
    utterance.lang = "en-IN";

    const voices = speechSynthesis.getVoices();

    const femaleVoice = voices.find(
        voice =>
            voice.name.includes("Female") ||
            voice.name.includes("Suhani") ||
            voice.name.includes("Ishita")
    );

    if (femaleVoice) {
        utterance.voice = femaleVoice;
    }

    speechSynthesis.speak(utterance);

}

// Voice recognition 

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = false;

    voiceBtn.addEventListener("click", () => {

        voiceStatus.textContent = "Listening...";

        recognition.start();

    });

    recognition.onresult = function (event) {

        const transcript = event.results[0][0].transcript;

        userInput.value = transcript;

        voiceStatus.textContent = "Ready to listen";

        sendMessage();

    };

    recognition.onerror = function (event) {

        console.log("VOICE ERROR:", event.error);

        voiceStatus.textContent =
            "Voice Error: " + event.error;

    };

}