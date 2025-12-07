
import { User } from 'firebase/auth'
import Avatar, { AvatarFullConfig } from 'react-nice-avatar'
import { User as UserIcon } from 'lucide-react'
import { useMemo } from 'react'

interface AvatarAccessory {
  id: string;
  itemId: string;
  x: number;
  y: number;
  size: number;
  zIndex: number;
}

interface CustomAvatarConfig extends AvatarFullConfig {
  accessories?: AvatarAccessory[];
}

const underwaterItems: Record<string, string> = {
  trident: "🔱",
  snorkel: "🤿",
  surfboard: "🏄",
  fish: "🐠",
  shark: "🦈",
  shell: "🐚",
  anchor: "⚓",
  starfish: "⭐",
  crab: "🦀",
}

interface UserAvatarProps {
  user: User
  className?: string
}

export default function UserAvatar({ user, className = "h-8 w-8" }: UserAvatarProps) {
  const avatarConfig = useMemo(() => {
    if (!user.photoURL) return null

    // Try to parse photoURL as JSON config for react-nice-avatar
    if (user.photoURL.startsWith('{')) {
      try {
        return JSON.parse(user.photoURL) as CustomAvatarConfig
      } catch (e) {
        return null
      }
    }
    return null
  }, [user.photoURL])

  if (avatarConfig) {
    // Calculate scale factor based on className dimensions
    // Default 8 units = 32px, so scale accessories accordingly
    const accessories = avatarConfig.accessories || []

    return (
      <div className={`${className} relative`} style={{ isolation: 'isolate' }}>
        {/* Base avatar */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <Avatar {...avatarConfig} className="w-full h-full" />
        </div>

        {/* Accessories */}
        {accessories.map((acc) => {
          const icon = underwaterItems[acc.itemId]
          if (!icon) return null

          // Scale position and size relative to avatar size (base 160px in profile)
          const scaleFactor = 0.2 // roughly 32px / 160px
          const scaledX = acc.x * scaleFactor
          const scaledY = acc.y * scaleFactor
          const scaledSize = Math.max(8, acc.size * scaleFactor) // minimum 8px

          return (
            <div
              key={acc.id}
              className="absolute pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${scaledX}px, ${scaledY}px)`,
                fontSize: `${scaledSize}px`,
                zIndex: 20,
                filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))'
              }}
            >
              {icon}
            </div>
          )
        })}
      </div>
    )
  }

  if (user.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt={user.displayName || 'User'}
        className={`${className} rounded-full object-cover`}
      />
    )
  }

  return (
    <div className={`${className} rounded-full bg-medium-teal/20 flex items-center justify-center text-medium-teal border border-medium-teal/50 overflow-hidden`}>
      <UserIcon className="h-1/2 w-1/2" />
    </div>
  )
}

