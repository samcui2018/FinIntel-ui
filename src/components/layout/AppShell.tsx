import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppShell() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>
        <Outlet />
      </main>
    </div>
  );
}