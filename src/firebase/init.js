// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, serverTimestamp } from "firebase/firestore"; // Import serverTimestamp
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtoZwrM6MHC6SmMC6slv6pFJDcsIVEgTg",
  authDomain: "prompos-f3b52.firebaseapp.com",
  projectId: "prompos-f3b52",
  storageBucket: "prompos-f3b52.firebasestorage.app",
  messagingSenderId: "119446721235",
  appId: "1:119446721235:web:95564d66cf697e09a3ba26",
  measurementId: "G-04Z0HJVKF5",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const functions = getFunctions(firebaseApp);
const auth = getAuth(firebaseApp); // Use firebaseApp here
// const analytics = getAnalytics(app);

export { db, functions, auth, serverTimestamp, httpsCallable }; // Export the database
