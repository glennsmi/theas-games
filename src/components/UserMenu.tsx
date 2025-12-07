import { useState, useRef, useEffect } from 'react'
import { User, signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Settings, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import UserAvatar from './UserAvatar'

interface UserMenuProps {
  user: User
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        className="flex items-center gap-2 hover:bg-white/20 text-dark-navy"
        onClick={() => setIsOpen(!isOpen)}
      >
        <UserAvatar user={user} className="h-8 w-8" />
        <span className="hidden sm:inline-block font-medium">
          {user.displayName || user.email?.split('@')[0]}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-200 z-50">
          <div className="p-4 border-b border-gray-100">
            <p className="text-sm font-medium text-dark-navy truncate">
              {user.displayName || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
          <div className="p-1">
            <Link
              to="/profile"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-dark-navy hover:bg-light-teal/10 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
          <div className="p-1 border-t border-gray-100">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
