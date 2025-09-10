// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fit5032-wohub.firebaseapp.com",
  projectId: "fit5032-wohub",
  storageBucket: "fit5032-wohub.firebasestorage.app",
  messagingSenderId: "494178337506",
  appId: "1:494178337506:web:081729b7828911087e14bb"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp)

export default firebaseApp   
export { db }               