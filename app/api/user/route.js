import dbConnect from "../../../lib/mongoose";
import User from "../../../models/User";

// GET-Methode definieren
export async function GET(req) {
  try {
    await dbConnect(); // Verbindung zur Datenbank herstellen

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // userId aus den Query-Parametern extrahieren

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await User.findById(userId); // Benutzer in der Datenbank suchen

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ guthaben: user.guthaben }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Fehler:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
