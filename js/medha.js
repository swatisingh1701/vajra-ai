// Basic functioning

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

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

    try {

        const response = await fetch("/api/medha", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });

        const data = await response.json();

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


// Speech Function

function speak(text) {

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.pitch = 1;

    speechSynthesis.speak(utterance);

}