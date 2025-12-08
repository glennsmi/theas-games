import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { UserSubscription } from '@shared/schemas/subscription';

// Stripe Customer Portal login link
const STRIPE_BILLING_PORTAL_URL = 'https://billing.stripe.com/p/login/4gMbJ01ysbla3uH0ONak000';

export interface UserSubscriptionData extends Partial<UserSubscription> {
  tier: 'free' | 'premium';
}

/**
 * Fetches the subscription data for a user
 */
export const getUserSubscription = async (userId: string): Promise<UserSubscriptionData | null> => {
  if (!userId) return null;

  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    const userData = userSnap.data();
    const subscription = userData?.subscription;

    if (!subscription) {
      return { tier: 'free' };
    }

    return {
      tier: subscription.tier || 'free',
      status: subscription.status,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      currentPeriodEnd: subscription.currentPeriodEnd?.toDate?.() || subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    };
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return null;
  }
};

/**
 * Generates the Stripe billing portal URL with prefilled email
 */
export const getStripeBillingPortalUrl = (email: string): string => {
  const encodedEmail = encodeURIComponent(email);
  return `${STRIPE_BILLING_PORTAL_URL}?prefilled_email=${encodedEmail}`;
};

/**
 * Check if user has an active premium subscription
 */
export const isPremiumSubscription = (subscription: UserSubscriptionData | null): boolean => {
  if (!subscription) return false;
  return subscription.tier === 'premium' && 
    ['active', 'trialing'].includes(subscription.status || '');
};
