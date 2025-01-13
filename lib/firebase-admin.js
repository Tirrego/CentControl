import admin from "firebase-admin";

// Überprüfen, ob die Firebase-App bereits initialisiert wurde
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

// Exportiere die `auth`-Funktion des Admin SDKs
export const auth = admin.auth();

// Funktion zum Verifizieren des ID-Tokens
export const verifyIdToken = async (token) => {
  try {
    const decodedToken = await auth.verifyIdToken(token); // Verwende `auth` hier
    return decodedToken;
  } catch (error) {
    console.log("Fehler bei der Token-Verifizierung:", error);
    throw new Error(`Token konnte nicht verifiziert werden: ${error.message}`);
  }
};

export default admin;
