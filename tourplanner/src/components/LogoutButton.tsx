import { LogOut } from 'lucide-react';
import AuthService from '@/services/AuthService';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

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
    <Button
      variant="ghost"
      onClick={handleLogout}
      leftIcon={<LogOut className="w-4 h-4" />}
      aria-label="Logout"
      className="hover:bg-destructive/10 hover:text-destructive"
    >
      <span className="hidden lg:inline">Logout</span>
    </Button>
  );
};

export default LogoutButton;
