import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBwKDg4v02CE72PaEGLNnSLHwyz_ICP7pU",
    authDomain: "centcontrol-5d541.firebaseapp.com",
    projectId: "centcontrol-5d541",
    storageBucket: "centcontrol-5d541.firebasestorage.app",
    messagingSenderId: "976227257077",
    appId: "1:976227257077:web:3bd91a951ee5a4bce993bc"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Persistenz auf Browser-Session setzen
setPersistence(auth, browserLocalPersistence);

export { auth };