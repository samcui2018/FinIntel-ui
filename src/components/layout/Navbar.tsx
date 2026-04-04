
// export default Navbar;
import { Link, useNavigate } from "react-router-dom";
import BusinessSwitcher from "../BusinessSwitcher";
//import { clearCurrentBusiness } from "./utils/businessSession";
import { clearCurrentBusiness } from "../../utils/businessSession"

function Navbar() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    clearCurrentBusiness();
    navigate("/login");
  }

  return (
    <nav
      style={{
        padding: "16px 24px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link to="/">Dashboard</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/analytics">Analytics</Link>
        <Link to="/businesses">Businesses</Link>
        <BusinessSwitcher />
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span>{email}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;