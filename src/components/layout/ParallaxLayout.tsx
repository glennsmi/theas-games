import React, { useEffect, useState } from 'react'

interface ParallaxLayoutProps {
  children: React.ReactNode
}

export const ParallaxLayout: React.FC<ParallaxLayoutProps> = ({ children }) => {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-ice-aqua">
      {/* Parallax Background Layer */}
      <div
        className="fixed inset-0 z-0 w-full h-[120%] pointer-events-none"
        style={{
          transform: `translateY(-${offset * 0.3}px)`,
          backgroundImage: 'url(/Background_1500x.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Overlay for readability if needed, but keeping it airy as per PRD */}
      <div className="fixed inset-0 z-0 bg-white/10 pointer-events-none mix-blend-overlay" />

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  )
}
