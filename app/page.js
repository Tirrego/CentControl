import Image from "next/image"
import Einnahme from "@/components/Einnahme";
import ProtectedRoute from "@/components/ProtectedRoute";


export default function Home() {
  return (
    <ProtectedRoute>
    <div>
      <Einnahme />
    </div>
    </ProtectedRoute>
  );
}
