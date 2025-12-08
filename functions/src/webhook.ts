import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';
import Stripe from 'stripe';
import { 
  COLLECTIONS, 
  FirestoreSubscriptionDocument 
} from './shared';

import { db } from './init';

// Define secrets using Firebase Secret Manager
const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');
const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');

export const stripeWebhook = onRequest(
  { 
    secrets: [stripeSecretKey, stripeWebhookSecret],
    region: 'europe-west2',
  }, 
  async (request, response) => {
    // Initialize Stripe inside the function handler so secrets are available
    const stripe = new Stripe(stripeSecretKey.value(), {
      apiVersion: '2025-11-17.clover' as any,
    });

    const sig = request.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      if (!sig || !stripeWebhookSecret.value()) {
        throw new Error('Missing signature or webhook secret');
      }
      event = stripe.webhooks.constructEvent(request.rawBody, sig, stripeWebhookSecret.value());
    } catch (err) {
      logger.error('Webhook signature verification failed.', err);
      response.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`);
      return;
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        default:
          logger.info(`Unhandled event type: ${event.type}`);
      }

      response.json({ received: true });
    } catch (err) {
      logger.error('Error handling webhook event', err);
      response.status(500).send('Internal Server Error');
    }
  }
);

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId || !subscriptionId) {
    logger.warn('Missing userId or subscriptionId in checkout session', { sessionId: session.id });
    return;
  }

  logger.info(`Checkout completed for user ${userId}`);

  // We wait for the subscription updated event to handle the full sync, 
  // but we can ensure the user has the customer ID linked immediately.
  await db.collection(COLLECTIONS.USERS).doc(userId).set({
    subscription: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
    }
  }, { merge: true });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;
  
  // Find the user by stripeCustomerId
  // Note: This requires an index on 'subscription.stripeCustomerId' in Firestore
  const usersSnapshot = await db.collection(COLLECTIONS.USERS)
    .where('subscription.stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (usersSnapshot.empty) {
    logger.warn(`No user found for Stripe Customer ID: ${customerId}`);
    return;
  }

  const userDoc = usersSnapshot.docs[0];
  const userId = userDoc.id;

  // Map Stripe status to our internal status
  // Simplified logic: Active/Trialing = Premium, else Free (or check product ID for tier)
  const isPremium = ['active', 'trialing'].includes(status);
  const tier = isPremium ? 'premium' : 'free';

  // Fix: Cast to any to access properties if the SDK types are mismatching or strict
  const sub = subscription as any;

  const subscriptionData: Partial<FirestoreSubscriptionDocument> = {
    id: subscription.id,
    userId: userId,
    stripeCustomerId: customerId,
    status: status as any,
    tier: tier,
    currentPeriodStart: admin.firestore.Timestamp.fromMillis(sub.current_period_start * 1000),
    currentPeriodEnd: admin.firestore.Timestamp.fromMillis(sub.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: subscription.canceled_at ? admin.firestore.Timestamp.fromMillis(subscription.canceled_at * 1000) : null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    items: subscription.items.data.map((item: any) => ({
      id: item.id,
      priceId: item.price.id,
      quantity: item.quantity,
    })),
  };

  // 1. Update the standalone Subscriptions collection
  await db.collection('subscriptions').doc(subscription.id).set(subscriptionData, { merge: true });

  // 2. Update the User document with summarized status
  await userDoc.ref.set({
    subscription: {
      tier,
      status: status as any,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd: admin.firestore.Timestamp.fromMillis(sub.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    }
  }, { merge: true });

  logger.info(`Updated subscription for user ${userId} to ${status}`);
}
