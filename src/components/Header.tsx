
import { Link } from 'react-router-dom'
import { User } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import UserMenu from './UserMenu'

interface HeaderProps {
  user: User | null
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <img src="/thea-mermaid-logo-transparent.png" alt="Logo" className="h-20  w-20 object-contain" />
              <span className="text-2xl font-bold text-dark-navy tracking-tight">Thea's Games</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-dark-navy hover:text-medium-teal px-3 py-2 text-md font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-dark-navy hover:text-medium-teal px-3 py-2 text-md font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/helping-the-environment"
              className="text-dark-navy hover:text-medium-teal px-3 py-2 text-md font-medium transition-colors"
            >
              Helping The Environment
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Link to="/auth">
                <Button variant="default" className="text-md bg-medium-teal hover:bg-light-teal text-white shadow-md hover:shadow-lg transition-all">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}


