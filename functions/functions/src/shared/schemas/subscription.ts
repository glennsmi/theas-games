import { z } from 'zod';

export const subscriptionTierSchema = z.enum(['free', 'premium']);

export const subscriptionStatusSchema = z.enum([
  'active',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'trialing',
  'unpaid',
  'paused',
]);

export const userSubscriptionSchema = z.object({
  tier: subscriptionTierSchema.default('free'),
  status: subscriptionStatusSchema.optional(),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  currentPeriodEnd: z.date().optional(),
  cancelAtPeriodEnd: z.boolean().default(false),
});

export const firestoreUserSubscriptionSchema = userSubscriptionSchema.extend({
  currentPeriodEnd: z.union([z.date(), z.any()]).optional(),
});

// Standalone Subscription Document Schema (for 'subscriptions' collection)
// This contains more detailed info than the embedded user object
export const subscriptionDocumentSchema = z.object({
  id: z.string(), // Stripe Subscription ID
  userId: z.string(),
  stripeCustomerId: z.string(),
  status: subscriptionStatusSchema,
  tier: subscriptionTierSchema,
  email: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  cancelAtPeriodEnd: z.boolean(),
  canceledAt: z.date().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  items: z.array(z.object({
    id: z.string(),
    priceId: z.string(),
    quantity: z.number().optional(),
  })).optional(),
});

export const firestoreSubscriptionDocumentSchema = subscriptionDocumentSchema.extend({
  currentPeriodStart: z.union([z.date(), z.any()]),
  currentPeriodEnd: z.union([z.date(), z.any()]),
  canceledAt: z.union([z.date(), z.any()]).optional().nullable(),
  createdAt: z.union([z.date(), z.any()]),
  updatedAt: z.union([z.date(), z.any()]),
});

export type SubscriptionTier = z.infer<typeof subscriptionTierSchema>;
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;
export type UserSubscription = z.infer<typeof userSubscriptionSchema>;
export type FirestoreUserSubscription = z.infer<typeof firestoreUserSubscriptionSchema>;
export type SubscriptionDocument = z.infer<typeof subscriptionDocumentSchema>;
export type FirestoreSubscriptionDocument = z.infer<typeof firestoreSubscriptionDocumentSchema>;
