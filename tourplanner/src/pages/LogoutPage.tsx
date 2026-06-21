import { toast } from 'sonner';
import { api } from "@/api/ApiClient";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const logoutCalled = useRef(false);

  useEffect(() => {
    if (logoutCalled.current) return;
    logoutCalled.current = true;

    async function logoutUser() {
      try {
        await api.post("/api/auth/logout", {});
        logout();
        toast.success('Logged out successfully');
      } catch (error) {
        toast.error('Logout failed, but session cleared');
      } finally {
        navigate("/login");
      }
    }

    logoutUser();
  }, [navigate, logout]);

  return <div>Logging out...</div>;
}