import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { MenuIcon, XIcon, SunIcon, MoonIcon } from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuth } from '@/context/AuthContext'

interface NavLinkType {
  name: string
  path: string
}

const publicNavLinks: NavLinkType[] = [
  { name: 'Login', path: '/login' },
  { name: 'Register', path: '/register' }
]

const protectedNavLinks: NavLinkType[] = [
  { name: 'Tours', path: '/tours' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Profile', path: '/profile' },
  { name: 'Logout', path: '/logout' },
  
]

export const Navbar = ({ theme, setTheme }: { theme: 'light' | 'dark'; setTheme: (theme: 'light' | 'dark') => void }) => {
  const { isAuthenticated } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const navLinks = isAuthenticated ? protectedNavLinks : publicNavLinks


  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      if (!e.matches) setIsMenuOpen(false)
    }
    setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-primary/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-navbar max-w-6xl items-center justify-between px-6">

        <NavLink
          to="/"
          className="group relative font-serif text-3xl font-bold tracking-tighter text-secondary transition-all duration-300 hover:text-accent"
        >
          <span className="relative z-10">Tour</span>
          <span className="text-accent">Planner</span>
          <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-accent transition-all duration-300 group-hover:w-full" />
        </NavLink>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'relative font-serif text-xl font-light tracking-wide transition-all duration-200',
                    isActive
                      ? 'text-secondary after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-secondary'
                      : 'text-muted hover:text-secondary'
                  )
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          className="hidden md:flex items-center justify-center w-9 h-9 rounded-full text-secondary hover:bg-accent/10 hover:text-accent transition-all duration-300 cursor-pointer"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon size={23} /> : <SunIcon size={23} />}
        </button>

        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-secondary hover:bg-accent/10 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      </nav>

      {isMobile && (
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-out border-t border-border',
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <ul className="flex flex-col px-6 py-6 gap-5 bg-primary">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block font-serif text-base tracking-wide py-1 transition-colors duration-200',
                      isActive ? 'text-secondary' : 'text-muted hover:text-secondary'
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