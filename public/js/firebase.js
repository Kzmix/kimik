import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUQzQ4xHWV_ttI4LZN8YJDjL6YX08u9Mk",
  authDomain: "komik-app-e57f0.firebaseapp.com",
  projectId: "komik-app-e57f0",
  storageBucket: "komik-app-e57f0.appspot.com",
  messagingSenderId: "380035260952",
  appId: "1:380035260952:web:a27ec2843b83f166a7d96d"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);