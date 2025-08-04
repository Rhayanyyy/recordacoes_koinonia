import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDx7T6bMgtNFuiI3ZNngYN-a7fhslXeR9k",
  authDomain: "recordacoes-koinoniaa.firebaseapp.com",
  projectId: "recordacoes-koinoniaa",
  storageBucket: "recordacoes-koinoniaa.appspot.com", // ✅ Aqui está o conserto!
  messagingSenderId: "18159549925",
  appId: "1:18159549925:web:f7d9f28e73b65fc76fc30c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);