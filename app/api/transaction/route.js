import dbConnect from "../../../lib/mongoose";
import Transaction from "../../../models/Transaction";
import User from "../../../models/User";

export async function POST(req) {
  try {
    const id = "67813eb85712ee7896043f77"; // Benutzer-ID (dies kann auch dynamisch gemacht werden)
    console.log("API-Request gestartet");

    // Verbindung zur Datenbank herstellen
    await dbConnect();
    console.log("Datenbank verbunden");

    // Daten aus dem Request-Body lesen
    const body = await req.json();
    console.log("Request Body:", body);

    const { amount, transactionType } = body; 

    // Überprüfen, ob ein gültiger Betrag und Typ vorliegen
    if (!amount || !transactionType) {
      throw new Error("Invalid transaction data");
    }

    // Neues Dokument für die Transaktion erstellen
    const transaction = new Transaction({
      amount,
      type: transactionType, 
      userId: id, 
    });
    await transaction.save();
    console.log("Transaktion gespeichert:", transaction);

    // Benutzer finden und Guthaben aktualisieren
    const user = await User.findById(id);
    
    if (!user) {
      throw new Error("User not found");
    }

    // Guthaben aktualisieren, basierend auf dem Transaktionstyp
    if (transactionType === "add") {
      user.guthaben += amount; // Einnahme -> Guthaben erhöhen
    } else if (transactionType === "sub") {
      user.guthaben -= amount; // Ausgabe -> Guthaben verringern
    } else {
      throw new Error("Invalid transaction type");
    }

    // Benutzer mit aktualisiertem Guthaben speichern
    await user.save();
    console.log("Benutzer-Guthaben aktualisiert:", user.guthaben);

    // Erfolgreiche Antwort zurückgeben
    return new Response(
      JSON.stringify({ message: "Transaction added", transaction, guthaben: user.guthaben }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Fehler:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
