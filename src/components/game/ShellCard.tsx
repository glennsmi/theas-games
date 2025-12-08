import { cn } from "@/lib/utils"

interface ShellCardProps {
  content: string
  isOpen: boolean
  isMatched: boolean
  onClick: () => void
}

export function ShellCard({ content, isOpen, isMatched, onClick }: ShellCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer transition-all duration-500 hover:scale-105",
        "w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40",
        isMatched ? "opacity-0 pointer-events-none scale-90" : "opacity-100"
      )}
    >
      {/* The Pearl/Content (Bottom Layer) */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        {/* Bottom Shell - Traditional Scallop Shape */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="bottomShellGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4C4E8" />
              <stop offset="100%" stopColor="#B8A4D4" />
            </linearGradient>
          </defs>
          {/* Scallop hinge/base at top */}
          <ellipse cx="50" cy="12" rx="18" ry="8" fill="#9B7BC0" stroke="#7A5CA0" strokeWidth="1.5" />
        </svg>

        {/* The Content Bubble */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-500",
          isOpen || isMatched ? "opacity-100 scale-100" : "opacity-0 scale-50"
        )}>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-inner border-2 border-medium-purple">
            <span className="text-4xl sm:text-5xl select-none filter drop-shadow-sm">{content}</span>
          </div>
        </div>
      </div>

      {/* The Top Shell (Cover Layer) - Traditional Scallop pointing down */}
      <div
        className={cn(
          "absolute inset-0 z-10 transition-all duration-700 ease-in-out origin-top",
          isOpen || isMatched ? "-rotate-x-180 opacity-0 pointer-events-none" : "rotate-x-0 opacity-100"
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg filter">
          <defs>
            {/* Main purple gradient for shell - inverted for downward orientation */}
            <linearGradient id="shellGradient" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#6B4D94" /> {/* Deep purple at top (hinge) */}
              <stop offset="50%" stopColor="#8B6BB5" /> {/* Medium purple */}
              <stop offset="100%" stopColor="#A88BC7" /> {/* Lighter purple at bottom */}
            </linearGradient>
            {/* Highlight gradient for ridges */}
            <linearGradient id="ridgeHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
            </linearGradient>
            {/* Shadow for ridges */}
            <linearGradient id="ridgeShadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(107,77,148,0.6)" />
              <stop offset="100%" stopColor="rgba(107,77,148,0.3)" />
            </linearGradient>
          </defs>

          {/* Hinge at top */}
          <ellipse cx="50" cy="12" rx="12" ry="5" fill="#5A3D7A" stroke="#4A2D6A" strokeWidth="1" />

          {/* Traditional Scallop Shell Shape - pointing downward with lobed bottom edge */}
          <path
            d="M50,15 
               C50,15 35,18 25,30 
               C15,42 8,55 10,65 
               C12,75 18,82 22,85 
               C26,88 30,90 35,88 
               C38,92 42,95 50,95 
               C58,95 62,92 65,88 
               C70,90 74,88 78,85 
               C82,82 88,75 90,65 
               C92,55 85,42 75,30 
               C65,18 50,15 50,15 Z"
            fill="url(#shellGradient)"
            stroke="#5A3D7A"
            strokeWidth="2"
          />

          {/* Scalloped lobes at bottom - creating the fan effect */}
          <path
            d="M22,85 C26,92 32,95 38,92"
            fill="none"
            stroke="#7A5CA0"
            strokeWidth="1.5"
          />
          <path
            d="M38,92 C42,97 47,98 50,95"
            fill="none"
            stroke="#7A5CA0"
            strokeWidth="1.5"
          />
          <path
            d="M50,95 C53,98 58,97 62,92"
            fill="none"
            stroke="#7A5CA0"
            strokeWidth="1.5"
          />
          <path
            d="M62,92 C68,95 74,92 78,85"
            fill="none"
            stroke="#7A5CA0"
            strokeWidth="1.5"
          />

          {/* Radiating ridges from hinge at top - Traditional scallop pattern */}
          {/* Center ridge */}
          <path d="M50,18 Q50,55 50,90" stroke="url(#ridgeHighlight)" strokeWidth="2" fill="none" />
          <path d="M51,18 Q51,55 51,90" stroke="url(#ridgeShadow)" strokeWidth="1" fill="none" />

          {/* Inner ridges - left */}
          <path d="M50,18 Q42,50 38,88" stroke="url(#ridgeHighlight)" strokeWidth="1.5" fill="none" />
          <path d="M50,18 Q34,45 26,82" stroke="url(#ridgeHighlight)" strokeWidth="1.5" fill="none" />

          {/* Inner ridges - right */}
          <path d="M50,18 Q58,50 62,88" stroke="url(#ridgeHighlight)" strokeWidth="1.5" fill="none" />
          <path d="M50,18 Q66,45 74,82" stroke="url(#ridgeHighlight)" strokeWidth="1.5" fill="none" />

          {/* Outer ridges - left */}
          <path d="M50,18 Q26,40 15,65" stroke="url(#ridgeHighlight)" strokeWidth="1" fill="none" />
          <path d="M50,18 Q20,35 12,58" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none" />

          {/* Outer ridges - right */}
          <path d="M50,18 Q74,40 85,65" stroke="url(#ridgeHighlight)" strokeWidth="1" fill="none" />
          <path d="M50,18 Q80,35 88,58" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none" />

          {/* Subtle inner glow/highlight */}
          <ellipse cx="45" cy="55" rx="8" ry="12" fill="rgba(255,255,255,0.15)" />
        </svg>
      </div>
    </div>
  )
}
