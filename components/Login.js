"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setError(null); // Clear any previous errors
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Logged in as:", userCredential.user);
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error.message);
      setError("Login fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-[#030E24] shadow-xl rounded-lg w-96 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Willkommen zurück!
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Bitte melden Sie sich mit Ihrer E-Mail und Ihrem Passwort an.
        </p>
        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="E-Mail-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Anmelden
          </button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          Noch keinen Account?{" "}
          <a href="/register" className="text-purple-600 font-medium hover:underline">
            Registrieren
          </a>
        </p>
      </div>
    </div>
  );
}
