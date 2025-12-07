import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'


import { User } from 'firebase/auth'

interface HomePageProps {
  user: User | null
}

export default function HomePage({ user }: HomePageProps) {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[80vh] space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80 mb-8">
          <img
            src="/theas-games-logo-transparent.png"
            alt="Thea's Games Logo"
            className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
          />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-dark-navy tracking-tight drop-shadow-sm">
          Thea's Games
        </h1>

        <p className="text-xl md:text-2xl text-dark-navy/80 max-w-2xl mx-auto font-medium">
          A magical underwater world of fun, learning, and ocean conservation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/game">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all bg-medium-teal hover:bg-light-teal text-white border-2 border-white/20">
              Play Now
            </Button>
          </Link>
          {!user && (
            <Link to="/auth">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all bg-medium-purple hover:bg-deep-purple text-white">
                Create Account
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Game Modes Section */}
      <div className="w-full max-w-5xl px-4">
        <h2 className="text-3xl font-bold text-dark-navy text-center mb-8">Choose Your Adventure</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Simple Match Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-pale-aqua hover:border-medium-teal transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 group">
            <CardHeader className="pb-2">
              <div className="text-4xl mb-2">🐚</div>
              <CardTitle className="text-xl text-dark-navy group-hover:text-medium-teal transition-colors">Simple Match</CardTitle>
              <CardDescription className="text-medium-purple font-medium text-sm">Classic Memory Game</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-dark-navy/70 text-sm">
                Flip shells to find matching pairs of tropical fish, seahorses, and more!
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/game" className="w-full">
                <Button variant="outline" className="w-full border-medium-teal text-medium-teal hover:bg-medium-teal hover:text-white">
                  Play
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Ocean Dash Card - NEW! */}
          <Card className="bg-gradient-to-br from-white/95 to-light-teal/20 backdrop-blur-sm border-2 border-bright-coral hover:border-sandy-coral transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-bright-coral text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
              NEW!
            </div>
            <CardHeader className="pb-2">
              <div className="text-4xl mb-2">🧜‍♀️</div>
              <CardTitle className="text-xl text-dark-navy group-hover:text-bright-coral transition-colors">Ocean Dash</CardTitle>
              <CardDescription className="text-medium-purple font-medium text-sm">Endless Swimming Adventure</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-dark-navy/70 text-sm">
                Help Thea swim through the ocean, collect pearls, and avoid jellyfish!
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/ocean-dash" className="w-full">
                <Button className="w-full bg-bright-coral hover:bg-sandy-coral text-white">
                  Play Now
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Educational Match Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-pale-aqua hover:border-medium-teal transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 group">
            <CardHeader className="pb-2">
              <div className="text-4xl mb-2">📚</div>
              <CardTitle className="text-xl text-dark-navy group-hover:text-medium-teal transition-colors">Educational Match</CardTitle>
              <CardDescription className="text-medium-purple font-medium text-sm">Learn While You Play</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-dark-navy/70 text-sm">
                Match creatures to their names and explore ocean secrets.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/game" className="w-full">
                <Button variant="outline" className="w-full border-medium-teal text-medium-teal hover:bg-medium-teal hover:text-white">
                  Play
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Conservation Message */}
      <div className="max-w-4xl mx-auto text-center p-8 bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm">
        <h2 className="text-2xl font-bold text-dark-navy mb-2">Protect Our Oceans</h2>
        <p className="text-dark-navy/80">
          Every game you play helps us learn more about the beautiful creatures that call the ocean home.
        </p>
      </div>
    </div>
  )
}


