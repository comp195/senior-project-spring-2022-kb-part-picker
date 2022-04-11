// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, onValue, onDisconnect } from "firebase/database"

import { useEffect, useState } from "react";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1Vf6c-D4wZqEEIIgSgsFtnhbqJQ-cpms",
  authDomain: "kb-part-picker.firebaseapp.com",
  databaseURL: "https://kb-part-picker-default-rtdb.firebaseio.com",
  projectId: "kb-part-picker",
  storageBucket: "kb-part-picker.appspot.com",
  messagingSenderId: "426592123226",
  appId: "1:426592123226:web:ded22643aeaa1848701b63",
  measurementId: "G-S1M40ZSC9V"
};

// Initialize Firebase
const fire = initializeApp(firebaseConfig);
export const db = getDatabase();
const connectedRef = ref(db, ".info/connected");
onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
    console.log("connected");
  } else {
    console.log("not connected");
  }
});

export default fire