import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAjfKBhUQNkWnzBS3C4Up1PbFrGBcPpA1Y",
    authDomain: "loja-f2c5b.firebaseapp.com",
    projectId: "loja-f2c5b",
    storageBucket: "loja-f2c5b.firebasestorage.app",
    messagingSenderId: "424675580118",
    appId: "1:424675580118:web:0c80caea47c87f62729177",
    measurementId: "G-3K4DBM2QFD"
  };
  
  // Initialize Firebase
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const db = getFirestore()
  
  export { app, db, auth }

  