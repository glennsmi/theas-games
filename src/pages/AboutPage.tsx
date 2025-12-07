import { Waves, Gamepad2, Brain, Heart, Sparkles, Users, Palette, Rocket } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32 md:w-40 md:h-40 animate-bounce-slow">
            <img src="/theas-games-logo-transparent.png" alt="Thea's Games Logo" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
        </div>
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-purple-600 mb-6">
          Welcome to Thea's Games
        </h1>
        <p className="text-xl text-blue-800 max-w-2xl mx-auto leading-relaxed">
          A magical underwater world where fun meets learning! Dive in to play, explore, and grow your memory skills.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="max-w-5xl mx-auto mb-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/50">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-blue-900 mb-4 flex items-center gap-3">
                <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
                Our Story
              </h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Thea's Games was built with love by <strong>Thea</strong> and her <strong>Uncle Glenn</strong>.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We both share a huge passion for mermaids, the ocean, and playing games! We wanted to create something special that isn't just fun to play, but also helps you get smarter by improving your memory. We built this platform together to share our joy with the world.
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-100 p-6 rounded-2xl text-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <span className="text-4xl">🧜‍♀️</span>
                  <p className="mt-2 font-bold text-purple-700">Mermaids</p>
                </div>
                <div className="bg-teal-100 p-6 rounded-2xl text-center transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <span className="text-4xl">🎮</span>
                  <p className="mt-2 font-bold text-teal-700">Games</p>
                </div>
                <div className="bg-blue-100 p-6 rounded-2xl text-center transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <span className="text-4xl">🌊</span>
                  <p className="mt-2 font-bold text-blue-700">Ocean</p>
                </div>
                <div className="bg-pink-100 p-6 rounded-2xl text-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <span className="text-4xl">🧠</span>
                  <p className="mt-2 font-bold text-pink-700">Memory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission / Features Grid */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Why Play With Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-b-4 border-teal-400">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
              <Brain className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Boost Your Brain</h3>
            <p className="text-gray-600">
              Our games are designed to be super fun while secretly training your memory and concentration skills.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-b-4 border-blue-400">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Waves className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Love Our Oceans</h3>
            <p className="text-gray-600">
              Explore a beautiful underwater world and learn about the amazing creatures that live in our seas.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-b-4 border-purple-400">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Magical Rewards</h3>
            <p className="text-gray-600">
              Earn pearls as you play and unlock special treasures. It's a rewarding journey every step of the way!
            </p>
          </div>
        </div>
      </div>

      {/* Future Roadmap Section */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-4 flex items-center justify-center gap-3">
            <Rocket className="w-8 h-8 text-orange-500" />
            Coming Soon!
          </h2>
          <p className="text-lg text-blue-700">
            We have big plans for Thea's Games. Here is a sneak peek at what we are building next:
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-1 shadow-lg">
            <div className="bg-white rounded-xl p-6 flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg shrink-0">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Create Your Own Games</h3>
                <p className="text-gray-600">
                  Soon you will be able to be the creator! Use our "Creative Layer" to build your own puzzles and share them with friends.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-400 to-blue-500 rounded-2xl p-1 shadow-lg">
            <div className="bg-white rounded-xl p-6 flex items-start gap-4">
              <div className="p-3 bg-teal-100 rounded-lg shrink-0">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Play with Friends</h3>
                <p className="text-gray-600">
                  Challenge your friends to a head-to-head memory match battle! Who will be the memory master?
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl p-1 shadow-lg">
            <div className="bg-white rounded-xl p-6 flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-lg shrink-0">
                <Gamepad2 className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">More Games & Avatars</h3>
                <p className="text-gray-600">
                  We are adding new game modes, more difficulty levels, and tons of new mermaid and sea creature avatars to customize!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




