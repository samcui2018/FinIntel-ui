import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
// import RequireBusiness from "./RequireBusiness";

export default function AppShell() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <Navbar />

      <main
        style={{
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* Optional business guard */}
          {/* 
          <RequireBusiness>
            <Outlet />
          </RequireBusiness>
          */}

          <Outlet />
        </div>
      </main>
    </div>
  );
}