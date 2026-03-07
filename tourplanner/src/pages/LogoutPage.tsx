import { api } from "@/api/ApiClient";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    async function logoutUser() {
      try {
        await api.post("/api/auth/logout", {});
        logout();
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        navigate("/login");
      }
    }

    logoutUser();
  }, [navigate, logout]);

  return <div>Logging out...</div>;
}