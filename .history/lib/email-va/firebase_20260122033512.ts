// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAixvY9V-KjRRMM_R-p-DUfnu4ykh-lLI0",
  authDomain: "digitalcowboy.firebaseapp.com",
  projectId: "digitalcowboy",
  storageBucket: "digitalcowboy.firebasestorage.app",
  messagingSenderId: "410798536076",
  appId: "1:410798536076:web:9629321f5b2b1890e752a9",
  measurementId: "G-QKSZNDW05C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);