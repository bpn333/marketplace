import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyBAgdZIS7E2t6PPpGvsonZfGcvRSjtvXQ4",
    authDomain: "marketplace-98ef5.firebaseapp.com",
    projectId: "marketplace-98ef5",
    storageBucket: "marketplace-98ef5.appspot.com",
    messagingSenderId: "1012973548046",
    appId: "1:1012973548046:web:0fdb420b9a3596ba64425f",
    measurementId: "G-WB4DPQHGE7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);