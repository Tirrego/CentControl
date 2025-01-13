import dbConnect from "../../../../lib/mongoose";
import User from "../../../../models/User";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

// GET: Abrufen der Konten des Benutzers
export async function GET(req) {
  try {
    // userId aus der URL als Query-Parameter extrahieren
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ error: "Benutzer-ID fehlt" }), { status: 400 });
    }

    // Verbindung zur MongoDB herstellen
    await dbConnect();

    // Benutzer anhand des userId finden
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

// POST: Neues Konto für den Benutzer hinzufügen
export async function POST(req) {
  try {
    // userId aus der URL als Query-Parameter extrahieren
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ error: "Benutzer-ID fehlt" }), { status: 400 });
    }

    const { name } = await req.json();

    if (!name) {
      return new Response(JSON.stringify({ error: "Kontoname erforderlich" }), { status: 400 });
    }

    // Verbindung zur MongoDB herstellen
    await dbConnect();

    // Benutzer anhand des userId finden
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
    console.error("Fehler beim Hinzufügen des Kontos:", error);
    return new Response(JSON.stringify({ error: "Fehler beim Hinzufügen des Kontos" }), { status: 500 });
  }
}

// DELETE: Löschen eines Kontos
export async function DELETE(req) {
  try {
    // userId aus der URL als Query-Parameter extrahieren
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ error: "Benutzer-ID fehlt" }), { status: 400 });
    }

    const { name } = await req.json();

    if (!name) {
      return new Response(JSON.stringify({ error: "Kontoname erforderlich" }), { status: 400 });
    }

    // Verbindung zur MongoDB herstellen
    await dbConnect();

    // Benutzer anhand des userId finden
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
