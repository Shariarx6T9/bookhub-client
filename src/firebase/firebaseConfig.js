// src/firebase/firebase.config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8uvyHVPX3nnMaPVEkQyGshGHtjX-f3To",
  authDomain: "the-book-haven-shariar.firebaseapp.com",
  projectId: "the-book-haven-shariar",
  storageBucket: "the-book-haven-shariar.firebasestorage.app",
  messagingSenderId: "649809181863",
  appId: "1:649809181863:web:9c86cd0e6925384f25af82",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
