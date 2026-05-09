import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
// import RequireBusiness from "./RequireBusiness";

export default function AppShell() {
  const isDemo = localStorage.getItem("isDemo") === "true";
  const demoExpiresAtUtc = localStorage.getItem("demoExpiresAtUtc");
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
          {isDemo && (
            <div className="rounded-md border px-3 py-2 text-sm">
              Demo mode active
              {demoExpiresAtUtc
                ? ` — session expires at ${new Date(demoExpiresAtUtc).toLocaleTimeString()}`
                : ""}
            </div>
          )}
          
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