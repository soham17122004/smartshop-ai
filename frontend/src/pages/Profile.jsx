import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaShieldAlt } from "react-icons/fa";

function Profile() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
        <div style={{
          background: "var(--card-bg, #1a1a2e)",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          color: "#fff"
        }}>
          <h1 style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <FaUser /> User Profile
          </h1>
          <hr style={{ borderColor: "#333", marginBottom: "20px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <p><strong><FaUser /> Name:</strong> {user?.full_name || "N/A"}</p>
            <p><strong><FaEnvelope /> Email:</strong> {user?.email || "N/A"}</p>
            <p><strong><FaShieldAlt /> Account ID:</strong> #{user?.id || "N/A"}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
