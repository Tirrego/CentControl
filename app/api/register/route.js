import dbConnect from "../../../lib/mongoose";
import User from "../../../models/User";
import { auth } from "../../../lib/firebase-admin"; // auth korrekt importieren

export async function POST(req) {
  try {
    // Verbindung zur Datenbank herstellen
    await dbConnect();
    console.log("Verbindung zur Datenbank hergestellt");

    // Extrahiere die Benutzerdaten aus der Anfrage
    const { email, password } = await req.json();

    // Validierung der Anfrage
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email und Passwort sind erforderlich" }),
        { status: 400 }
      );
    }

    // Firebase-Authentifizierung (Benutzer erstellen)
    const userCredential = await auth.createUser({
      email,
      password,
    });

    const userId = userCredential.uid; // Firebase UID des neu erstellten Benutzers

    // Neues Benutzerobjekt erstellen
    const newUser = new User({
      user: userId, // Firebase UID des Benutzers
      accounts: [
        { name: "Konto", balance: 0 },
        { name: "Bargeld", balance: 0 },
        { name: "Sparkonto", balance: 0 },
      ],
      guthaben: 0,
    });

    // Benutzer in der Datenbank speichern
    await newUser.save();

    // Erfolgreiche Antwort zurückgeben
    return new Response(
      JSON.stringify({ message: "Benutzer erfolgreich erstellt!" }),
      { status: 201 }
    );
  } catch (error) {
    // Fehlerbehandlung mit detaillierten Logs
    console.error("Fehler bei der Benutzerregistrierung:", error);
    
    // Antwort mit Fehlermeldung
    return new Response(
      JSON.stringify({ error: error.message || "Fehler bei der Benutzerregistrierung" }),
      { status: 500 }
    );
  }
}
