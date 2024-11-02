
// firebaseConfig.js

// Import necessary Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCLlfvVpFviergGasVRopbV2Os1aqyTbCM",
    authDomain: "tourism-d9a61.firebaseapp.com",
    databaseURL: "https://tourism-d9a61-default-rtdb.firebaseio.com",
    projectId: "tourism-d9a61",
    storageBucket: "tourism-d9a61.appspot.com",
    messagingSenderId: "796681953485",
    appId: "1:796681953485:web:406745487836dd47f7c984",
    measurementId: "G-PLYB1X21Q1"
  };

// Initialize Firebase and Database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
