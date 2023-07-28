import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA7XrEvKddS98SMY8rfnDsk2FluHzkIHDU",
    authDomain: "justmusicollection.firebaseapp.com",
    databaseURL: "https://justmusicollection-default-rtdb.firebaseio.com",
    projectId: "justmusicollection",
    storageBucket: "justmusicollection.appspot.com",
    messagingSenderId: "871244630840",
    appId: "1:871244630840:web:afa60af598a25ed8340fcd",
    measurementId: "G-YKXDFM16B6"
  };


export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getDatabase(app);