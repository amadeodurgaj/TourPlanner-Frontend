import { LogOut } from 'lucide-react';
import AuthService from '@/services/AuthService';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      logout();
      navigate('/login');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth active-press"
      aria-label="Logout"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden lg:inline">Logout</span>
    </button>
  );
};

export default LogoutButton;
