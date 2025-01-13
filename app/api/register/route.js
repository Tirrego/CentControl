import dbConnect from "../../../lib/mongoose";
import User from "../../../models/User";
import { auth } from "../../../lib/firebase-admin"; // auth korrekt importieren

export async function POST(req) {
  try {
    await dbConnect(); // Verbindung zur Datenbank herstellen
    console.log("Verbinung hergestellt");
    const { email, password } = await req.json(); // Benutzer-Details aus der Anfrage extrahieren

    // Neuen Benutzer mit Firebase erstellen (Admin SDK verwenden)
    const userCredential = await auth.createUser({
      email,
      password,
    });

    const userId = userCredential.uid; // Firebase UID des neu registrierten Benutzers

    // Neues Benutzerobjekt erstellen
    const newUser = new User({
      user: userId, // Hier wird die Firebase UID verwendet
      accounts: [
        { name: "Konto", balance: 0 },
        { name: "Bargeld", balance: 0 },
        { name: "Sparkonto", balance: 0 },
      ],
      guthaben: 0,
    });

    // Benutzer speichern
    await newUser.save();

    // Erfolgreiche Antwort zurückgeben
    return new Response(JSON.stringify({ message: "Benutzer erfolgreich erstellt!" }), {
      status: 201,
    });
  } catch (error) {
    console.error("Fehler bei der Benutzerregistrierung:", error);  // Fehlerdetails hier ausgeben
    return new Response(JSON.stringify({ error: "Fehler bei der Benutzerregistrierung" }), {
      status: 500,
    });
  }
}
