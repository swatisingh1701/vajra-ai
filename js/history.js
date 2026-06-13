import { auth, db } from "./firebase-config.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const historyList = document.getElementById("historyList");

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    historyList.innerHTML = "Please login to view history.";
    return;
  }

  try {
    const q = query(collection(db, "users", user.uid, "history"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      historyList.innerHTML = "No activity yet.";
      return;
    }

    let html = "";

    snapshot.forEach((doc) => {
      const data = doc.data();
      let colorClass = "blue";

      if (data.feature.includes("Phishing")) colorClass = "red";
      if (data.feature.includes("URL")) colorClass = "orange";
      if (data.feature.includes("IP")) colorClass = "cyan";

      html += `
        <div class="history-item ${colorClass}">
          <h3>${data.feature}</h3>
          <p><b>Input:</b> ${data.input}</p>
          <p><b>Result:</b> ${data.result}</p>
          <span>${new Date(data.timestamp.seconds * 1000).toLocaleString()}</span>
        </div>
      `;
    });

    historyList.innerHTML = html;
  } catch (error) {
    console.error(error);
    historyList.innerHTML = "Failed to load history.";
  }
});