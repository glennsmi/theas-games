import { Link } from 'react-router-dom'
import { User } from 'firebase/auth'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  user: User | null
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <img src="/Theas_games_logo_500x500.png" alt="Logo" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold text-dark-navy tracking-tight">Thea's Games</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-dark-navy hover:text-medium-teal px-3 py-2 text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-dark-navy hover:text-medium-teal px-3 py-2 text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/games"
              className="text-dark-navy hover:text-medium-teal px-3 py-2 text-sm font-medium transition-colors"
            >
              Games
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline-block text-sm font-medium text-dark-navy">
                  {user.displayName || user.email}
                </span>
                <Button variant="default" size="sm" className="bg-medium-teal hover:bg-light-teal text-white">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="default" size="sm" className="bg-medium-teal hover:bg-light-teal text-white shadow-md hover:shadow-lg transition-all">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}


