import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-20 bg-dark-navy/95 backdrop-blur-md text-white mt-auto">
      {/* Decorative wave top border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-light-teal via-medium-purple to-bright-coral" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <Link to="/" className="block mb-4">
              <img
                src="/theas-games-logo-transparent.png"
                alt="Thea's Games Logo"
                className="w-24 h-24 object-contain hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <p className="text-pale-aqua text-sm text-center md:text-left">
              Fun games with an ocean conservation message! 🌊
            </p>
          </div>

          {/* Games */}
          <div className="text-center md:text-left">
            <h3 className="text-light-teal font-bold text-lg mb-4 flex items-center justify-center md:justify-start gap-2">
              <span>🎮</span> Games
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/game" className="text-pale-aqua hover:text-light-teal transition-colors text-sm">
                  Simple Match
                </Link>
              </li>
              <li>
                <Link to="/ocean-dash" className="text-pale-aqua hover:text-light-teal transition-colors text-sm">
                  Ocean Dash
                </Link>
              </li>
              <li>
                <Link to="/pollution-patrol" className="text-pale-aqua hover:text-light-teal transition-colors text-sm">
                  Pollution Patrol
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn More */}
          <div className="text-center md:text-left">
            <h3 className="text-light-teal font-bold text-lg mb-4 flex items-center justify-center md:justify-start gap-2">
              <span>🐋</span> Learn More
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-pale-aqua hover:text-light-teal transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/ocean-pollution" className="text-pale-aqua hover:text-light-teal transition-colors text-sm">
                  Ocean Pollution
                </Link>
              </li>
              <li>
                <Link to="/helping-the-environment" className="text-pale-aqua hover:text-light-teal transition-colors text-sm">
                  Helping the Environment
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="text-center md:text-left">
            <h3 className="text-light-teal font-bold text-lg mb-4 flex items-center justify-center md:justify-start gap-2">
              <span>📧</span> Contact
            </h3>
            <a 
              href="mailto:hello@theasgames.com" 
              className="text-bright-coral hover:text-sandy-coral transition-colors text-sm font-medium"
            >
              hello@theasgames.com
            </a>
            
            <h3 className="text-light-teal font-bold text-lg mt-6 mb-4 flex items-center justify-center md:justify-start gap-2">
              <span>📜</span> Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-pale-aqua hover:text-light-teal transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-pale-aqua hover:text-light-teal transition-colors text-sm">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-pale-aqua hover:text-light-teal transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-medium-purple/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-pale-aqua/70 text-sm text-center md:text-left">
              © {currentYear} Thea's Games. All rights reserved. Made with 💙 for our oceans.
            </p>
            <div className="flex items-center gap-4 text-2xl">
              <span title="Protect our oceans">🐠</span>
              <span title="Save the turtles">🐢</span>
              <span title="Keep our seas clean">🌊</span>
              <span title="Love our dolphins">🐬</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
