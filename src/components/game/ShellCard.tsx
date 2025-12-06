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
        {/* Bottom Shell Shadow/Base */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md text-pale-aqua fill-current">
          <path d="M10,50 Q20,80 50,90 Q80,80 90,50 Q80,20 50,10 Q20,20 10,50 Z" />
        </svg>

        {/* The Content Bubble */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-500",
          isOpen || isMatched ? "opacity-100 scale-100" : "opacity-0 scale-50"
        )}>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-inner border-2 border-light-teal">
            <span className="text-4xl sm:text-5xl select-none filter drop-shadow-sm">{content}</span>
          </div>
        </div>
      </div>

      {/* The Top Shell (Cover Layer) */}
      <div
        className={cn(
          "absolute inset-0 z-10 transition-all duration-700 ease-in-out origin-top",
          isOpen || isMatched ? "-rotate-x-180 opacity-0" : "rotate-x-0 opacity-100"
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg filter">
          {/* Shell Ridges/Texture */}
          <defs>
            <linearGradient id="shellGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5DD3C3" /> {/* Light Teal */}
              <stop offset="100%" stopColor="#40B5A8" /> {/* Medium Teal */}
            </linearGradient>
          </defs>

          {/* Main Shell Shape */}
          <path
            d="M10,50 Q20,90 50,95 Q80,90 90,50 Q80,10 50,5 Q20,10 10,50 Z"
            fill="url(#shellGradient)"
            stroke="#1E3A5F"
            strokeWidth="2"
          />

          {/* Decorative Ridges */}
          <path d="M50,5 Q50,50 50,95" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
          <path d="M50,5 Q30,50 20,80" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
          <path d="M50,5 Q70,50 80,80" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
          <path d="M50,5 Q20,40 15,60" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
          <path d="M50,5 Q80,40 85,60" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
        </svg>
      </div>
    </div>
  )
}
