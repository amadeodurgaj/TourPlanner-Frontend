import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MenuIcon, XIcon, SunIcon, MoonIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/LogoutButton";

interface NavLinkType {
  name: string;
  path: string;
}

const publicNavLinks: NavLinkType[] = [
  { name: "Login", path: "/login" },
  { name: "Register", path: "/register" },
];

const protectedNavLinks: NavLinkType[] = [
  { name: "Tours", path: "/tours" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Profile", path: "/profile" },
];

export const Navbar = ({
  theme,
  setTheme,
}: {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}) => {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navLinks = isAuthenticated ? protectedNavLinks : publicNavLinks;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      if (!e.matches) setIsMenuOpen(false);
    };
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Enhanced with gradient and better spacing */}
        <NavLink
          to="/"
          className="group relative flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground transition-smooth"
        >
          <span className="text-foreground">Tour</span>
          <span className="text-gradient">Planner</span>
          <span className="absolute -bottom-1.5 left-0 h-1 w-0 bg-gradient-to-r from-accent to-accent-hover transition-all duration-300 group-hover:w-full" />
        </NavLink>

        {/* Desktop Navigation - Enhanced spacing and visual feedback */}
        <ul className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "relative rounded-xl px-4 py-2.5 text-sm font-medium transition-smooth hover-lift",
                    isActive
                      ? "bg-accent/10 text-accent shadow-soft ring-1 ring-accent/20"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Actions - Enhanced theme toggle */}
        <div className="hidden md:flex items-center gap-3">
          <button
            className="icon-button hover:scale-110"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <MoonIcon size={18} /> : <SunIcon size={18} />}
          </button>

          {isAuthenticated && <LogoutButton />}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="icon-button md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-out",
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-1 border-t border-border/70 px-4 pb-4 pt-2 sm:px-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "block rounded-lg px-4 py-2.5 text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-accent/15 text-accent ring-1 ring-accent/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="mt-2 border-t border-border/70 pt-2">
            <button
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
              onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
                setIsMenuOpen(false);
              }}
            >
              {theme === "light" ? <MoonIcon size={16} /> : <SunIcon size={16} />}
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
