import { z } from 'zod';
import { userSubscriptionSchema, firestoreUserSubscriptionSchema } from './subscription';

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Parent specific fields
  isParentVerified: z.boolean().default(false),
  subscription: userSubscriptionSchema.optional(),
  
  // Legacy fields (might be removed later or kept for backwards compatibility if needed)
  pearls: z.number().optional(),
  totalGamesPlayed: z.number().optional(),
  lastPlayedAt: z.date().optional(),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().optional(),
});

export const updateUserSchema = z.object({
  displayName: z.string().optional(),
  isParentVerified: z.boolean().optional(),
});

export const paginationSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(10),
  orderBy: z.string().optional(),
  orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Firestore document schemas
export const firestoreUserSchema = userSchema.extend({
  createdAt: z.union([z.date(), z.any()]), // Allow Firestore Timestamp
  updatedAt: z.union([z.date(), z.any()]), // Allow Firestore Timestamp
  lastPlayedAt: z.union([z.date(), z.any()]).optional(),
  subscription: firestoreUserSubscriptionSchema.optional(),
});

export const createFirestoreUserSchema = createUserSchema.extend({
  createdAt: z.union([z.date(), z.any()]).optional(),
  updatedAt: z.union([z.date(), z.any()]).optional(),
});

// Collection names as constants
export const COLLECTIONS = {
  USERS: 'users',
  CHILDREN: 'children', // Sub-collection of users usually, but defining key here
  POSTS: 'posts',
} as const;

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type FirestoreUser = z.infer<typeof firestoreUserSchema>;
export type CreateFirestoreUser = z.infer<typeof createFirestoreUserSchema>;
