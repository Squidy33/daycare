// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBbARpQlq0plg2ATPRjsHP9Jc6leSUFzTg",
    authDomain: "daycare-5537c.firebaseapp.com",
    databaseURL: "https://daycare-5537c-default-rtdb.firebaseio.com",
    projectId: "daycare-5537c",
    storageBucket: "daycare-5537c.firebasestorage.app",
    messagingSenderId: "399902882927",
    appId: "1:399902882927:web:937160e7a002375952a19a",
    measurementId: "G-1E44MNP46R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

export { database, analytics }; 