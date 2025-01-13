import dbConnect from "../../../lib/mongoose";
import Transaction from "../../../models/Transaction";
import User from "../../../models/User";

export async function GET(req) {
  try {
    await dbConnect();

    // Benutzer-ID aus den Anfrageparametern extrahieren
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Benutzer-ID erforderlich" }),
        { status: 400 }
      );
    }

    // Benutzer anhand der ID finden
    const user = await User.findOne({ user: userId });
    if (!user) {
      return new Response(JSON.stringify({ error: "Benutzer nicht gefunden" }), {
        status: 404,
      });
    }

    // Transaktionen des Benutzers abrufen
    const transactions = await Transaction.find({ user: user._id });

    return new Response(
      JSON.stringify({ transactions }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Fehler beim Abrufen der Transaktionen:", error);
    return new Response(
      JSON.stringify({ error: "Fehler beim Abrufen der Transaktionen" }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect(); // Verbindung zur Datenbank herstellen

    // Transaktionsdetails und Benutzer-ID aus der Anfrage extrahieren
    const { amount, transactionType, details, userId, accountName } = await req.json(); // `accountName` für das benutzte Konto

    // Überprüfen, ob die Benutzer-ID existiert
    const user = await User.findOne({ user: userId });
    if (!user) {
      return new Response(JSON.stringify({ error: "Benutzer nicht gefunden" }), { status: 404 });
    }

    // Das entsprechende Account-Objekt aus dem `accounts` Array finden
    const account = user.accounts.find(acc => acc.name === accountName);

    if (!account) {
      return new Response(JSON.stringify({ error: "Account nicht gefunden" }), { status: 404 });
    }

    if(transactionType) {

    account.balance += amount;
    user.guthaben += amount;
    } else {

    account.balance -= amount;
    user.guthaben -= amount;

    }

    // Neue Transaktion erstellen und Benutzer referenzieren
    const newTransaction = new Transaction({
      accounts: accountName, // Hier kannst du das Konto speichern, auf dem die Transaktion ausgeführt wurde
      amount,
      type : transactionType,
      details,
      user: user._id, // Verknüpft die Transaktion mit dem Benutzer
    });

    // Benutzer speichern
    await user.save();

    // Transaktion speichern
    await newTransaction.save();

    // Erfolgreiche Antwort zurückgeben
    return new Response(JSON.stringify({ message: "Transaktion erfolgreich gespeichert!" }), { status: 201 });
  } catch (error) {
    console.error("Fehler beim Speichern der Transaktion:", error);
    return new Response(JSON.stringify({ error: "Fehler beim Speichern der Transaktion" }), { status: 500 });
  }
}
