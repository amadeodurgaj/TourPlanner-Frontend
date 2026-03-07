import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { MenuIcon, XIcon, SunIcon, MoonIcon } from 'lucide-react'
import { cn } from '../lib/utils'

interface NavLinkType {
  name: string
  path: string
}

const navLinks: NavLinkType[] = [
  
  { name: 'Tours', path: '/tours' },
  { name: 'Dashboard', path: '/dashboard' },
  { name:'Profile',path: '/profile'},
  { name: 'Login', path: '/login' },
  { name: 'Register', path: '/register' }
]

export const Navbar = ({ theme, setTheme }: { theme: 'light' | 'dark'; setTheme: (theme: 'light' | 'dark') => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Track whether we're in mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      if (!e.matches) setIsMenuOpen(false) // close menu when resizing to desktop
    }
    setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--secondary)]/50 bg-primary/80 backdrop-md">
      <nav className="mx-auto flex h-[var(--navbar-height)] max-w-6xl items-center justify-between px-6">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-bold tracking-tight text-[var(--secondary)] hover:opacity-80 transition-opacity font-mono"
        >
          Tour Planner
        </NavLink>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'text-lg font-medium transition-colors duration-200',
                    isActive
                      ? 'text-[var(--secondary)] border-b-2 border-[var(--secondary)] pb-0.7'
                      : 'text-[var(--secondary)]/60 hover:text-[var(--secondary)]'
                  )
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Theme Toggle Button */}
        <button
          className="hidden md:flex items-center justify-center w-9 h-9 rounded-md text-secondary hover:bg-white/10 transition-colors cursor-pointer"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
        </button>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-secondary hover:bg-white/10 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobile && (
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-white/10',
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <ul className="flex flex-col px-6 py-4 gap-4 bg-primary">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block text-sm font-medium py-1 transition-colors duration-200',
                      isActive ? 'text-white' : 'text-white/60 hover:text-white'
                    )
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}