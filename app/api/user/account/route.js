import dbConnect from "../../../../lib/mongoose";
import User from "../../../../models/User";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"; // Firebase Auth importieren

// GET: Abrufen der Konten des Benutzers
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    await dbConnect();

    // Benutzer anhand der ID finden
    const user = await User.findOne({ user: userId });

    if (!user) {
      return new Response(JSON.stringify({ error: "Benutzer nicht gefunden" }), { status: 404 });
    }

    // Konten des Benutzers zurückgeben
    return new Response(JSON.stringify({ accounts: user.accounts }), { status: 200 });
  } catch (error) {
    console.error("Fehler beim Abrufen der Konten:", error);
    return new Response(JSON.stringify({ error: "Fehler beim Abrufen der Konten" }), { status: 500 });
  }
}

// POST: Benutzer registrieren und Konto hinzufügen
export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return new Response(JSON.stringify({ error: "E-Mail, Passwort und Kontoname sind erforderlich" }), { status: 400 });
    }

    // Firebase Auth-Objekt erhalten
    const auth = getAuth();

    // Benutzer über Firebase registrieren
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // E-Mail-Verifizierung über Firebase senden
    await sendEmailVerification(firebaseUser);

    await dbConnect();

    // Benutzer anhand der ID aus der MongoDB-Datenbank finden
    const user = await User.findOne({ user: userId });

    if (!user) {
      return new Response(JSON.stringify({ error: "Benutzer nicht gefunden" }), { status: 404 });
    }

    // Neues Konto hinzufügen
    user.accounts.push({ name, balance: 0 });

    // Benutzer speichern
    await user.save();

    return new Response(JSON.stringify({ accounts: user.accounts }), { status: 201 });
  } catch (error) {
    console.error("Fehler bei der Registrierung und beim Hinzufügen des Kontos:", error);
    return new Response(JSON.stringify({ error: "Fehler bei der Registrierung und beim Hinzufügen des Kontos" }), { status: 500 });
  }
}

// DELETE: Löschen eines Kontos
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const { name } = await req.json();

    if (!name) {
      return new Response(JSON.stringify({ error: "Kontoname erforderlich" }), { status: 400 });
    }

    await dbConnect();

    // Benutzer anhand der ID finden
    const user = await User.findOne({ user: userId });

    if (!user) {
      return new Response(JSON.stringify({ error: "Benutzer nicht gefunden" }), { status: 404 });
    }

    // Konto löschen
    user.accounts = user.accounts.filter(account => account.name !== name);

    // Benutzer speichern
    await user.save();

    return new Response(JSON.stringify({ accounts: user.accounts }), { status: 200 });
  } catch (error) {
    console.error("Fehler beim Löschen des Kontos:", error);
    return new Response(JSON.stringify({ error: "Fehler beim Löschen des Kontos" }), { status: 500 });
  }
}
