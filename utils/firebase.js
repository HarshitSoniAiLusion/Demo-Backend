// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "ailusion-tryon-demo.firebaseapp.com",
  projectId: "ailusion-tryon-demo",
  storageBucket: "ailusion-tryon-demo.appspot.com",
  messagingSenderId: "322692276420",
  appId: "1:322692276420:web:db7e177adef32828946991",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
