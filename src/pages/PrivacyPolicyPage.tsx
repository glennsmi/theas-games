import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-12 border-2 border-pale-aqua">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">🔒</span>
          <h1 className="text-4xl font-bold text-dark-navy mb-2">Privacy Policy</h1>
          <p className="text-medium-purple text-lg">Keeping Your Information Safe in Our Ocean!</p>
          <p className="text-sm text-dark-navy/60 mt-2">Last updated: December 2024</p>
        </div>

        {/* Introduction */}
        <section className="mb-8 p-6 bg-ice-aqua/50 rounded-xl border border-pale-aqua">
          <div className="flex items-start gap-4">
            <span className="text-3xl">🐙</span>
            <div>
              <h2 className="text-xl font-bold text-dark-navy mb-2">Hello, Ocean Explorer!</h2>
              <p className="text-dark-navy/80">
                Welcome to Thea's Games! Just like how we protect sea creatures in our games, 
                we also protect your personal information. This policy explains how we keep 
                your data safe while you're having fun exploring our underwater adventures!
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🐚</span>
              <h2 className="text-2xl font-bold text-dark-navy">1. What Information Do We Collect?</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>Like collecting shells on the beach, we only collect what we need:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Account Information:</strong> If you create an account, we save your email address and display name so you can log back in.</li>
                <li><strong>Game Progress:</strong> Your high scores and achievements - so you can show off your ocean-saving skills!</li>
                <li><strong>Cookie Preferences:</strong> Whether you've accepted our cookie policy (more on that below).</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🦀</span>
              <h2 className="text-2xl font-bold text-dark-navy">2. How Do We Use Your Information?</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>We use your information to make your gaming experience amazing:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Save your game progress so you don't lose your hard work</li>
                <li>Let you compete on leaderboards with other ocean heroes</li>
                <li>Keep your account secure</li>
                <li>Make our games even better based on how you play</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🐋</span>
              <h2 className="text-2xl font-bold text-dark-navy">3. Who Do We Share Information With?</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>We're like protective dolphins - we keep your information safe and don't share it with just anyone!</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>We DO NOT sell your personal information</strong> - ever!</li>
                <li>We use Firebase (by Google) to safely store your data</li>
                <li>We may share information if required by law (like if a real-life superhero asks us to!)</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🐢</span>
              <h2 className="text-2xl font-bold text-dark-navy">4. Children's Privacy (COPPA)</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>
                We love our young ocean explorers! If you're under 13, please ask a parent 
                or guardian before creating an account. We take extra special care of 
                children's information:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>We collect the minimum information needed</li>
                <li>Parents can request to see or delete their child's data</li>
                <li>We don't show personalised ads to children</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🔐</span>
              <h2 className="text-2xl font-bold text-dark-navy">5. How Do We Keep Your Data Safe?</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>We use strong protections, like a clam guarding a pearl:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Encrypted connections (HTTPS) for all data</li>
                <li>Secure Firebase authentication</li>
                <li>Regular security updates</li>
                <li>Limited access to personal information</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⚓</span>
              <h2 className="text-2xl font-bold text-dark-navy">6. Your Rights</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>You're the captain of your data! You can:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Access:</strong> Ask to see what information we have about you</li>
                <li><strong>Correct:</strong> Update your information if it's wrong</li>
                <li><strong>Delete:</strong> Ask us to delete your account and data</li>
                <li><strong>Object:</strong> Say no to certain uses of your data</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at{' '}
                <a href="mailto:hello@theasgames.com" className="text-bright-coral hover:text-sandy-coral font-medium">
                  hello@theasgames.com
                </a>
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🌊</span>
              <h2 className="text-2xl font-bold text-dark-navy">7. Changes to This Policy</h2>
            </div>
            <div className="ml-10 space-y-4 text-dark-navy/80">
              <p>
                Sometimes we need to update this policy, just like the ocean tides change. 
                If we make big changes, we'll let you know. Keep swimming back to check!
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="mt-8 p-6 bg-gradient-to-r from-light-teal/20 to-medium-purple/20 rounded-xl border border-medium-teal/30">
            <div className="flex items-start gap-4">
              <span className="text-3xl">📬</span>
              <div>
                <h2 className="text-xl font-bold text-dark-navy mb-2">Questions? Get in Touch!</h2>
                <p className="text-dark-navy/80 mb-4">
                  If you have any questions about this Privacy Policy or how we handle your 
                  data, send us a message! We're always happy to help.
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
