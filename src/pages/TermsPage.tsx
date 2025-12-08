import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-12 border-2 border-pale-aqua">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">📜</span>
          <h1 className="text-4xl font-bold text-dark-navy mb-2">Terms & Conditions</h1>
          <p className="text-medium-purple text-lg">The Ocean Explorer's Code</p>
          <p className="text-sm text-dark-navy/60 mt-2">Last updated: December 2024</p>
        </div>

        {/* Introduction */}
        <section className="mb-8 p-6 bg-ice-aqua/50 rounded-xl border border-pale-aqua">
          <div className="flex items-start gap-4">
            <span className="text-3xl">🧭</span>
            <div>
              <h2 className="text-xl font-bold text-dark-navy mb-2">Welcome, Ocean Explorer!</h2>
              <p className="text-dark-navy/80">
                Before you dive into our underwater world of fun and games, let's go over the 
                rules of the sea! By using Thea's Games, you agree to follow this code. 
                Don't worry - it's all about making sure everyone has a safe and fun time!
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Section 1 - Acceptance */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🤝</span>
              <h2 className="text-2xl font-bold text-dark-navy">1. Agreeing to Our Terms</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>
                By playing our games and using our website, you're agreeing to follow these terms. 
                It's like joining a crew - everyone needs to follow the same rules!
              </p>
              <p>
                If you're under 18, please make sure a parent or guardian has read these terms too.
              </p>
            </div>
          </section>

          {/* Section 2 - Using Our Games */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🎮</span>
              <h2 className="text-2xl font-bold text-dark-navy">2. Using Our Games</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>Our games are free to play and made for fun! Here's what we ask:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Play fair - no cheating or using special programs to get higher scores</li>
                <li>Be kind - if you interact with others, treat them like you'd want to be treated</li>
                <li>Don't try to break our games or website</li>
                <li>Don't copy our games or pretend they're yours</li>
              </ul>
            </div>
          </section>

          {/* Section 3 - Accounts */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">👤</span>
              <h2 className="text-2xl font-bold text-dark-navy">3. Your Account</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>If you create an account:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Keep your password secret - don't share it with anyone!</li>
                <li>Use accurate information when signing up</li>
                <li>Tell us if you think someone else is using your account</li>
                <li>You're responsible for everything that happens on your account</li>
              </ul>
              <p>
                If you're under 13, you need a parent or guardian's permission to create an account.
              </p>
            </div>
          </section>

          {/* Section 4 - Content Rules */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🐚</span>
              <h2 className="text-2xl font-bold text-dark-navy">4. Content Rules</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>
                If you're able to create any content (like usernames or messages), please make sure it's:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Friendly and appropriate for all ages</li>
                <li>Not mean, scary, or hurtful to others</li>
                <li>Not pretending to be someone else</li>
                <li>Not advertising or spam</li>
              </ul>
              <p>
                We can remove any content that doesn't follow these rules - just like how we 
                clean up pollution from the ocean!
              </p>
            </div>
          </section>

          {/* Section 5 - Our Stuff */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🎨</span>
              <h2 className="text-2xl font-bold text-dark-navy">5. Our Creative Work</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>
                All the games, artwork, music, characters (including Thea!), and other content 
                belong to Thea's Games. This includes:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Our games and how they work</li>
                <li>All the beautiful underwater artwork</li>
                <li>Our mermaid mascot Thea and her friends</li>
                <li>The Thea's Games name and logo</li>
              </ul>
              <p>
                You can play our games and share your scores, but please don't copy, sell, 
                or pretend our work is yours.
              </p>
            </div>
          </section>

          {/* Section 6 - No Guarantees */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🌊</span>
              <h2 className="text-2xl font-bold text-dark-navy">6. "As Is" Service</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>
                We work hard to keep our games running smoothly, but sometimes the sea gets stormy! 
                We provide our games "as is," which means:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Sometimes games might have bugs (the code kind, not sea creatures!)</li>
                <li>We might need to take games offline for updates</li>
                <li>We can't promise everything will work perfectly all the time</li>
              </ul>
              <p>
                We'll always do our best to fix problems quickly!
              </p>
            </div>
          </section>

          {/* Section 7 - Limitations */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⚓</span>
              <h2 className="text-2xl font-bold text-dark-navy">7. Limitation of Liability</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>
                Our games are free to play and meant for fun. We're not responsible for:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Any problems caused by using our games</li>
                <li>Lost game progress if something goes wrong</li>
                <li>How other people behave on our platform</li>
              </ul>
              <p>
                The maximum liability we have is limited to the extent permitted by law.
              </p>
            </div>
          </section>

          {/* Section 8 - Changes */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🔄</span>
              <h2 className="text-2xl font-bold text-dark-navy">8. Changes to Games & Terms</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>
                We might update our games or these terms from time to time - like how the ocean 
                is always changing! When we make big changes:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>We'll update the "Last updated" date at the top</li>
                <li>For major changes, we'll try to let you know</li>
                <li>Continuing to use our games means you accept the new terms</li>
              </ul>
            </div>
          </section>

          {/* Section 9 - Ending Access */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🚫</span>
              <h2 className="text-2xl font-bold text-dark-navy">9. Ending Access</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>
                If someone doesn't follow these rules, we might have to:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Give a friendly warning</li>
                <li>Remove inappropriate content</li>
                <li>Suspend or delete their account</li>
              </ul>
              <p>
                You can also delete your account anytime if you don't want to play anymore 
                (but we'll miss you! 🐠).
              </p>
            </div>
          </section>

          {/* Section 10 - Governing Law */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🏛️</span>
              <h2 className="text-2xl font-bold text-dark-navy">10. Governing Law</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>
                These terms are governed by the laws of the United Kingdom. Any disputes will 
                be handled in UK courts.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="mt-8 p-6 bg-gradient-to-r from-light-teal/20 to-medium-purple/20 rounded-xl border border-medium-teal/30">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🐋</span>
              <div>
                <h2 className="text-xl font-bold text-dark-navy mb-2">Questions?</h2>
                <p className="text-dark-navy/80 mb-4">
                  If you have any questions about these terms, or if you see someone not 
                  following the rules, please let us know!
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
