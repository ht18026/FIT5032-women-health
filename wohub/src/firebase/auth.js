import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";
import firebaseApp from "./init";

const auth = getAuth(firebaseApp);
const currentUser = ref(null);
const authIsReady = ref(false);

let authReadyPromise = new Promise((resolve) => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
    authIsReady.value = true;
    resolve(); 
  });
});

export { auth, currentUser, authIsReady, authReadyPromise };
