// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDx7T6bMgtNFuiI3ZNngYN-a7fhslXeR9k",
  authDomain: "recordacoes-koinoniaa.firebaseapp.com",
  projectId: "recordacoes-koinoniaa",
  storageBucket: "recordacoes-koinoniaa.appspot.com", // ✅ Aqui está o conserto!
  messagingSenderId: "18159549925",
  appId: "1:18159549925:web:f7d9f28e73b65fc76fc30c"
};
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, storage, auth, provider };
