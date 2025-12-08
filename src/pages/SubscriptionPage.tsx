import React from 'react';
import { auth } from '../config/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ParallaxLayer } from '@/components/layout/ParallaxLayout';

export default function SubscriptionPage() {
  const user = auth.currentUser;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-dark-navy mb-4">Unlock the Full Ocean Adventure! 🌊</h1>
        <p className="text-xl text-dark-navy/80">
          Get access to all games, exclusive avatar items, and create unlimited child profiles.
        </p>
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border-2 border-pale-aqua min-h-[600px]">
        <stripe-pricing-table
          pricing-table-id="prctbl_1Sc90BAgi6IzTg3FdlyWQEB5"
          publishable-key="pk_live_51Sc8F7Agi6IzTg3Ff7Xyyq7Mb10k3cbQ735W8SDhnKjCmPHazCXq14A3EQwFhwdWKrfa15fH4PfXfQohWNf9XI6B00Wcq3dWIe"
          client-reference-id={user?.uid}
          customer-email={user?.email || undefined}
        >
        </stripe-pricing-table>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <Card className="bg-white/80 border-none shadow-md">
          <CardHeader>
            <div className="text-4xl mb-2">🎮</div>
            <CardTitle>Unlimited Games</CardTitle>
            <CardDescription>Play all current and future games without limits</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="bg-white/80 border-none shadow-md">
          <CardHeader>
            <div className="text-4xl mb-2">🧜‍♀️</div>
            <CardTitle>Custom Avatars</CardTitle>
            <CardDescription>Unlock special items like mermaids, sharks, and tridents</CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white/80 border-none shadow-md">
          <CardHeader>
            <div className="text-4xl mb-2">👨‍👩‍👧‍👦</div>
            <CardTitle>Family Account</CardTitle>
            <CardDescription>Create individual profiles for up to 5 children</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
