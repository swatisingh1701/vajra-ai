import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBE5Nl9u5ypAeLF7TPmVUwORS4y4LZlsr8",
  authDomain: "vajra-ai-3c3a1.firebaseapp.com",
  projectId: "vajra-ai-3c3a1",
  storageBucket: "vajra-ai-3c3a1.firebasestorage.app",
  messagingSenderId: "449707557810",
  appId: "1:449707557810:web:73fdf16a64d890c7911aab"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);