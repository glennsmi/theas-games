import { useState, useRef, useEffect } from 'react'
import { User, signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Settings, ChevronDown, Users, Shield, User as UserIcon, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import UserAvatar from './UserAvatar'
import { useChild } from '@/context/ChildContext'
import { getStripeBillingPortalUrl } from '@/services/subscriptionService'
import Avatar from 'react-nice-avatar'

interface UserMenuProps {
  user: User
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { childrenProfiles, activeChild, setActiveChildId } = useChild()

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

  const handleOpenBillingPortal = () => {
    if (!user?.email) return
    const billingUrl = getStripeBillingPortalUrl(user.email)
    window.open(billingUrl, '_blank')
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        className="flex items-center gap-2 hover:bg-white/80 text-dark-navy hover:text-dark-navy"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative">
           {activeChild?.avatarConfig ? (
             <Avatar className="h-8 w-8 rounded-full" {...JSON.parse(activeChild.avatarConfig)} />
           ) : (
             <UserAvatar user={user} className="h-8 w-8" />
           )}
        </div>
        
        <span className="hidden sm:inline-block font-medium">
          {activeChild ? activeChild.displayName : (user.displayName || user.email?.split('@')[0])}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-200 z-50">
          <div className="p-4 border-b border-gray-100">
            <p className="text-sm font-medium text-dark-navy truncate">
              {user.displayName || 'Parent Account'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>

          {/* Child Profile Switcher */}
          {childrenProfiles.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              <p className="px-2 text-xs font-semibold text-gray-500 mb-2">Switch Profile</p>
              
              <button
                onClick={() => {
                  setActiveChildId(null)
                  setIsOpen(false)
                }}
                className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors ${!activeChild ? 'bg-light-teal/20 text-dark-navy' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                <div className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span>Parent Profile</span>
                {!activeChild && <span className="ml-auto text-xs text-medium-teal font-medium">Active</span>}
              </button>

              {childrenProfiles.map(child => (
                <button
                  key={child.id}
                  onClick={() => {
                    setActiveChildId(child.id)
                    setIsOpen(false)
                  }}
                  className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors mt-1 ${activeChild?.id === child.id ? 'bg-light-teal/20 text-dark-navy' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    {child.avatarConfig ? (
                       <Avatar className="w-full h-full" {...JSON.parse(child.avatarConfig)} />
                    ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                        <UserIcon className="w-3 h-3 text-blue-500" />
                      </div>
                    )}
                  </div>
                  <span>{child.displayName}</span>
                  {activeChild?.id === child.id && <span className="ml-auto text-xs text-medium-teal font-medium">Active</span>}
                </button>
              ))}
            </div>
          )}

          <div className="p-1">
            <Link
              to="/parent-dashboard"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-dark-navy hover:bg-light-teal/10 rounded-md transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              <Users className="h-4 w-4" />
              Parent Dashboard
            </Link>
             <Link
              to="/subscription"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-dark-navy hover:bg-light-teal/10 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Shield className="h-4 w-4" />
              Subscription
            </Link>
            <button
              onClick={handleOpenBillingPortal}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-dark-navy hover:bg-light-teal/10 rounded-md transition-colors"
            >
              <CreditCard className="h-4 w-4" />
              Manage Billing
            </button>
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
              onClick={() => {
                handleSignOut()
                setIsOpen(false)
              }}
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
