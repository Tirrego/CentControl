import dbConnect from "../../../lib/mongoose";
import Transaction from "../../../models/Transaction";
import User from "../../../models/User";

export async function POST(req) {
  try {
    console.log("API-Request gestartet");

    // Verbindung zur Datenbank herstellen
    await dbConnect();
    console.log("Datenbank verbunden");

    // Daten aus dem Request-Body lesen
    const body = await req.json();
    console.log("Request Body:", body);

    // Neues Dokument erstellen
    const transaction = new Transaction(body);
    await transaction.save();

    const user = await User.find();
    user[0].guthaben = user[0].guthaben + body.amount;
    await user[0].save();
  


    
    console.log("Transaktion gespeichert:", transaction);

    return new Response(JSON.stringify({ message: "Transaction added", transaction }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Fehler:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}