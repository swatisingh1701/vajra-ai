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
    const response = await fetch("https://vajra-ai-backend.onrender.com/api/medha", {
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

    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("please speak")) {
      speak(data.reply);
    }
  } catch (error) {
    loadingDiv.remove();
    addMessage("Unable to connect with MEDHA AI.", "bot");
  }
}

userInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function speak(text) {
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.pitch = 1.3;
  utterance.rate = 1;

  const voices = speechSynthesis.getVoices();
  const femaleVoice = voices.find(
    voice =>
      voice.name.includes("Zira") ||
      voice.name.includes("Samantha") ||
      voice.name.includes("Female")
  );

  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  speechSynthesis.speak(utterance);
}