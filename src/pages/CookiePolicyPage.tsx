import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-12 border-2 border-pale-aqua">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">🍪</span>
          <h1 className="text-4xl font-bold text-dark-navy mb-2">Cookie Policy</h1>
          <p className="text-medium-purple text-lg">Sea Cookies (Not the Eating Kind!)</p>
          <p className="text-sm text-dark-navy/60 mt-2">Last updated: December 2024</p>
        </div>

        {/* Fun Introduction */}
        <section className="mb-8 p-6 bg-gradient-to-r from-sandy-coral/20 to-bright-coral/20 rounded-xl border border-sandy-coral/30">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🦞</span>
            <div>
              <h2 className="text-xl font-bold text-dark-navy mb-2">Ahoy, Ocean Explorer!</h2>
              <p className="text-dark-navy/80">
                Welcome aboard! You might be wondering - do we have cookies at the bottom of the ocean? 
                Well, not the yummy chocolate chip kind! 🍫 Our "cookies" are tiny digital messages 
                that help make your underwater adventure even better. Let's dive in and learn more! 🤿
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="space-y-8">
          {/* What Are Cookies */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🐠</span>
              <h2 className="text-2xl font-bold text-dark-navy">What Are Cookies, Anyway?</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>
                Imagine tiny fish that remember things for you! That's kind of what cookies do. 
                They're small text files that websites save on your device to remember helpful 
                information.
              </p>
              <div className="bg-ice-aqua/50 p-4 rounded-lg border border-pale-aqua">
                <p className="font-medium text-dark-navy">
                  🐡 <strong>Fun Fact:</strong> They're called "cookies" because an early computer 
                  programmer thought they were like fortune cookies - small packages with a message inside!
                </p>
              </div>
            </div>
          </section>

          {/* Types of Cookies We Use */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🦑</span>
              <h2 className="text-2xl font-bold text-dark-navy">Our Underwater Cookie Collection</h2>
            </div>
            <div className="ml-10 space-y-6 text-dark-navy/80">
              <p>Here are the different types of helpful "sea cookies" we use:</p>
              
              {/* Essential Cookies */}
              <div className="p-4 bg-light-teal/20 rounded-xl border border-light-teal/40">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">⚓</span>
                  <h3 className="font-bold text-dark-navy">Essential Cookies (The Anchor Cookies)</h3>
                </div>
                <p className="ml-7">
                  These are like the anchor of a ship - absolutely necessary! They help the website 
                  work properly, keep you logged in, and remember your cookie choices.
                </p>
                <p className="ml-7 mt-2 text-sm text-medium-purple font-medium">
                  You can't turn these off because without them, the ship won't sail! ⛵
                </p>
              </div>

              {/* Functional Cookies */}
              <div className="p-4 bg-medium-purple/10 rounded-xl border border-medium-purple/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🐬</span>
                  <h3 className="font-bold text-dark-navy">Functional Cookies (The Dolphin Cookies)</h3>
                </div>
                <p className="ml-7">
                  These smart cookies are like friendly dolphins that remember your preferences! 
                  They help save your game settings and remember how you like to play.
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="p-4 bg-sandy-coral/10 rounded-xl border border-sandy-coral/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🦀</span>
                  <h3 className="font-bold text-dark-navy">Analytics Cookies (The Explorer Cookies)</h3>
                </div>
                <p className="ml-7">
                  These cookies are like curious crabs exploring the ocean floor! They help us 
                  understand how players use our games so we can make them even more fun. 
                  They don't collect personal information - just things like which games are 
                  most popular.
                </p>
              </div>
            </div>
          </section>

          {/* Firebase Cookies */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🔥</span>
              <h2 className="text-2xl font-bold text-dark-navy">Firebase Cookies</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>
                We use Firebase (made by Google) to run our games. Firebase uses its own cookies to:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Keep you logged into your account safely</li>
                <li>Save your game progress</li>
                <li>Make sure everything loads quickly</li>
              </ul>
              <p>
                You can learn more about Firebase's cookies at{' '}
                <a 
                  href="https://firebase.google.com/support/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-bright-coral hover:text-sandy-coral font-medium underline"
                >
                  Firebase Privacy
                </a>
              </p>
            </div>
          </section>

          {/* How Long Do Cookies Last */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⏰</span>
              <h2 className="text-2xl font-bold text-dark-navy">How Long Do Our Sea Cookies Live?</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>Different cookies have different lifespans, like sea creatures!</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Session Cookies (Jellyfish):</strong> These disappear when you close 
                  your browser - poof! Like a jellyfish floating away. 🪼
                </li>
                <li>
                  <strong>Persistent Cookies (Sea Turtles):</strong> These stick around longer, 
                  like wise old sea turtles. They remember you next time you visit! 🐢
                </li>
              </ul>
            </div>
          </section>

          {/* Managing Cookies */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🎮</span>
              <h2 className="text-2xl font-bold text-dark-navy">You're in Control!</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>
                You're the captain of your cookie ship! Here's how you can manage cookies:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Browser Settings:</strong> Most web browsers let you control cookies. 
                  Look in your browser's settings or preferences menu.
                </li>
                <li>
                  <strong>Our Cookie Banner:</strong> When you first visit, you can choose which 
                  cookies to accept (except the essential ones - we need those!).
                </li>
              </ul>
              <div className="bg-bright-coral/10 p-4 rounded-lg border border-bright-coral/30 mt-4">
                <p className="font-medium text-dark-navy">
                  ⚠️ <strong>Captain's Warning:</strong> If you block all cookies, some parts of 
                  our games might not work properly - like a submarine without a periscope!
                </p>
              </div>
            </div>
          </section>

          {/* Cookie Consent Storage */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📝</span>
              <h2 className="text-2xl font-bold text-dark-navy">Remembering Your Choices</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>
                When you tell us your cookie preferences, we remember them so you don't have to 
                tell us every time you visit. If you're logged in, we also save your consent 
                in our secure database so it follows you across devices!
              </p>
            </div>
          </section>

          {/* Updates */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🌊</span>
              <h2 className="text-2xl font-bold text-dark-navy">Changes to This Policy</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>
                Sometimes we need to update this policy, like when the tide changes. If we make 
                big changes, we'll let you know. Keep swimming back to check for updates!
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="mt-8 p-6 bg-gradient-to-r from-light-teal/20 to-medium-purple/20 rounded-xl border border-medium-teal/30">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🐙</span>
              <div>
                <h2 className="text-xl font-bold text-dark-navy mb-2">Questions About Cookies?</h2>
                <p className="text-dark-navy/80 mb-4">
                  If you have any questions about our cookies (or anything else!), 
                  our friendly team is here to help!
                </p>
                <p className="text-dark-navy font-medium">
                  Email us at:{' '}
                  <a href="mailto:hello@theasgames.com" className="text-bright-coral hover:text-sandy-coral">
                    hello@theasgames.com
                  </a>
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link to="/">
            <Button className="bg-medium-teal hover:bg-light-teal text-white px-8">
              🏠 Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
