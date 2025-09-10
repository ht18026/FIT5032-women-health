import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // import router
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/style.css'



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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
const app = createApp(App)
// Initialize Firebase
initializeApp(firebaseConfig);

app.use(router)              // use the router
app.mount('#app')