import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Logout() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logged out");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
