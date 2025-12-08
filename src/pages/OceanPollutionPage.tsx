import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function OceanPollutionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <span className="text-7xl mb-4 block animate-bounce-slow">🌊</span>
        <h1 className="text-4xl md:text-5xl font-bold text-dark-navy mb-4">
          Protecting Our Oceans
        </h1>
        <p className="text-xl text-dark-navy/80 max-w-2xl mx-auto">
          The ocean is home to millions of amazing creatures. Let's learn why it needs our help 
          and what we can do to protect it!
        </p>
      </div>

      {/* The Problem Section */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border-2 border-pale-aqua">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">😟</span>
            <h2 className="text-3xl font-bold text-dark-navy">The Problem: Ocean Pollution</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-dark-navy/80 text-lg">
                Our beautiful oceans are in trouble! Every year, millions of tonnes of rubbish 
                end up in the sea. This hurts the fish, turtles, dolphins, and all the other 
                creatures that call the ocean home.
              </p>
              <p className="text-dark-navy/80">
                Imagine if someone dumped rubbish in your bedroom - that's what it's like 
                for sea animals when we pollute their home!
              </p>
            </div>
            <div className="bg-ice-aqua/50 rounded-xl p-6 border border-pale-aqua">
              <h3 className="font-bold text-dark-navy mb-4 flex items-center gap-2">
                <span>📊</span> Shocking Facts
              </h3>
              <ul className="space-y-3 text-dark-navy/80">
                <li className="flex items-start gap-2">
                  <span className="text-bright-coral">•</span>
                  <span>8 million tonnes of plastic enter our oceans every year</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bright-coral">•</span>
                  <span>By 2050, there could be more plastic than fish in the ocean</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bright-coral">•</span>
                  <span>Over 1 million seabirds and 100,000 sea mammals are harmed by plastic each year</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bright-coral">•</span>
                  <span>Plastic can take up to 500 years to decompose</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Types of Pollution */}
      <div className="max-w-5xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-dark-navy text-center mb-8">
          Types of Ocean Pollution
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-pale-aqua hover:border-bright-coral transition-all duration-300 hover:shadow-xl">
            <CardHeader className="text-center pb-2">
              <span className="text-5xl mb-2 block">🥤</span>
              <CardTitle className="text-xl text-dark-navy">Plastic Pollution</CardTitle>
            </CardHeader>
            <CardContent className="text-dark-navy/80 text-sm">
              <p>
                Plastic bottles, bags, straws, and packaging are the biggest problem. 
                They break into tiny pieces called "microplastics" that sea animals 
                accidentally eat.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-2 border-pale-aqua hover:border-bright-coral transition-all duration-300 hover:shadow-xl">
            <CardHeader className="text-center pb-2">
              <span className="text-5xl mb-2 block">🛢️</span>
              <CardTitle className="text-xl text-dark-navy">Oil & Chemical Spills</CardTitle>
            </CardHeader>
            <CardContent className="text-dark-navy/80 text-sm">
              <p>
                Oil spills from ships and factories poison the water and coat sea animals 
                in sticky, harmful oil. Chemicals from farms and factories also flow 
                into the ocean.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-2 border-pale-aqua hover:border-bright-coral transition-all duration-300 hover:shadow-xl">
            <CardHeader className="text-center pb-2">
              <span className="text-5xl mb-2 block">🎣</span>
              <CardTitle className="text-xl text-dark-navy">Fishing Nets & Gear</CardTitle>
            </CardHeader>
            <CardContent className="text-dark-navy/80 text-sm">
              <p>
                Lost or abandoned fishing nets (called "ghost nets") float in the ocean 
                and trap dolphins, turtles, and fish. These nets can keep catching 
                animals for years!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Impact on Animals */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="bg-gradient-to-r from-deep-purple/10 to-medium-purple/10 rounded-2xl p-8 border border-medium-purple/30">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">💔</span>
            <h2 className="text-3xl font-bold text-dark-navy">How Pollution Hurts Sea Animals</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <span className="text-6xl block mb-3">🐢</span>
              <h3 className="font-bold text-dark-navy mb-2">Sea Turtles</h3>
              <p className="text-sm text-dark-navy/70">
                Turtles mistake plastic bags for jellyfish (their favourite food) and can choke on them.
              </p>
            </div>
            <div className="text-center">
              <span className="text-6xl block mb-3">🐬</span>
              <h3 className="font-bold text-dark-navy mb-2">Dolphins</h3>
              <p className="text-sm text-dark-navy/70">
                Dolphins get tangled in fishing nets and can swallow harmful plastic pieces.
              </p>
            </div>
            <div className="text-center">
              <span className="text-6xl block mb-3">🐋</span>
              <h3 className="font-bold text-dark-navy mb-2">Whales</h3>
              <p className="text-sm text-dark-navy/70">
                Whales have been found with stomachs full of plastic bags and rubbish.
              </p>
            </div>
            <div className="text-center">
              <span className="text-6xl block mb-3">🐠</span>
              <h3 className="font-bold text-dark-navy mb-2">Fish</h3>
              <p className="text-sm text-dark-navy/70">
                Fish eat tiny microplastics, which then enter the food chain and can reach humans.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What Can We Do */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border-2 border-light-teal">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">💪</span>
            <h2 className="text-3xl font-bold text-dark-navy">What Can YOU Do to Help?</h2>
          </div>
          
          <p className="text-lg text-dark-navy/80 mb-8">
            The good news is that everyone can help protect our oceans - even kids! 
            Here are some super ways you can make a difference:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Reduce */}
            <div className="bg-light-teal/10 rounded-xl p-6 border border-light-teal/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🚫</span>
                <h3 className="text-xl font-bold text-dark-navy">Reduce Plastic</h3>
              </div>
              <ul className="space-y-2 text-dark-navy/80">
                <li className="flex items-start gap-2">
                  <span className="text-light-teal">✓</span>
                  <span>Use a reusable water bottle instead of plastic ones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-light-teal">✓</span>
                  <span>Say no to plastic straws - use paper or metal ones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-light-teal">✓</span>
                  <span>Bring reusable bags when shopping</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-light-teal">✓</span>
                  <span>Choose products with less packaging</span>
                </li>
              </ul>
            </div>

            {/* Reuse */}
            <div className="bg-medium-purple/10 rounded-xl p-6 border border-medium-purple/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">♻️</span>
                <h3 className="text-xl font-bold text-dark-navy">Reuse & Recycle</h3>
              </div>
              <ul className="space-y-2 text-dark-navy/80">
                <li className="flex items-start gap-2">
                  <span className="text-medium-purple">✓</span>
                  <span>Always put rubbish in the correct recycling bin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-medium-purple">✓</span>
                  <span>Turn old containers into cool crafts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-medium-purple">✓</span>
                  <span>Donate toys and clothes you don't use anymore</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-medium-purple">✓</span>
                  <span>Fix things instead of throwing them away</span>
                </li>
              </ul>
            </div>

            {/* Clean Up */}
            <div className="bg-bright-coral/10 rounded-xl p-6 border border-bright-coral/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🧹</span>
                <h3 className="text-xl font-bold text-dark-navy">Clean Up</h3>
              </div>
              <ul className="space-y-2 text-dark-navy/80">
                <li className="flex items-start gap-2">
                  <span className="text-bright-coral">✓</span>
                  <span>Join a beach clean-up event in your area</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bright-coral">✓</span>
                  <span>Pick up rubbish when you see it (safely!)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bright-coral">✓</span>
                  <span>Never throw rubbish on the ground - even far from the sea!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bright-coral">✓</span>
                  <span>Organise a clean-up day with your school or friends</span>
                </li>
              </ul>
            </div>

            {/* Spread the Word */}
            <div className="bg-sandy-coral/10 rounded-xl p-6 border border-sandy-coral/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📢</span>
                <h3 className="text-xl font-bold text-dark-navy">Spread the Word</h3>
              </div>
              <ul className="space-y-2 text-dark-navy/80">
                <li className="flex items-start gap-2">
                  <span className="text-sandy-coral">✓</span>
                  <span>Tell your family and friends what you've learned</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sandy-coral">✓</span>
                  <span>Share facts about ocean pollution at school</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sandy-coral">✓</span>
                  <span>Make posters about protecting the ocean</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sandy-coral">✓</span>
                  <span>Be a role model - others will follow your example!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Hopeful Message */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-gradient-to-r from-light-teal/30 to-pale-aqua/50 rounded-2xl p-8 border border-light-teal/40 text-center">
          <span className="text-6xl block mb-4">🌟</span>
          <h2 className="text-3xl font-bold text-dark-navy mb-4">Every Little Action Helps!</h2>
          <p className="text-lg text-dark-navy/80 max-w-2xl mx-auto mb-6">
            You might think you're just one person, but when millions of people make small 
            changes, it adds up to a HUGE difference! The ocean needs heroes like you.
          </p>
          <p className="text-xl font-bold text-dark-navy">
            Together, we can make our oceans clean and safe for all the amazing creatures 
            that live there! 🐠🐢🐬🐋
          </p>
        </div>
      </div>

      {/* Play Our Games */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border-2 border-medium-purple text-center">
          <span className="text-5xl block mb-4">🎮</span>
          <h2 className="text-2xl font-bold text-dark-navy mb-4">
            Learn While You Play!
          </h2>
          <p className="text-dark-navy/80 mb-6">
            Play our games to learn more about ocean conservation while having fun! 
            In Pollution Patrol, you can help Thea clean up the ocean and save sea creatures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pollution-patrol">
              <Button className="bg-bright-coral hover:bg-sandy-coral text-white px-8 py-6 text-lg">
                ♻️ Play Pollution Patrol
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="border-medium-teal text-medium-teal hover:bg-medium-teal hover:text-white px-8 py-6 text-lg">
                🏠 Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
