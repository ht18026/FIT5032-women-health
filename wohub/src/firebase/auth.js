import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";
import firebaseApp from "./init";
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase/init"

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

export const getCurrentUserRole = async () => {
  if (!currentUser.value) return null; 

  const docRef = doc(db, "users", currentUser.value.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const role = docSnap.data().role;
    return role === "admin" ? "admin" : "user"; 
  } else {
    // create document for new user
    await setDoc(docRef, { role: "user" }, { merge: true });
    return "user";
  }
}

export { auth, currentUser, authIsReady, authReadyPromise };
