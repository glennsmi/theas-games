import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().optional(),
});

export const updateUserSchema = z.object({
  displayName: z.string().optional(),
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
});

export const createFirestoreUserSchema = createUserSchema.extend({
  createdAt: z.union([z.date(), z.any()]).optional(),
  updatedAt: z.union([z.date(), z.any()]).optional(),
});

// Collection names as constants
export const COLLECTIONS = {
  USERS: 'users',
  POSTS: 'posts',
} as const;

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type FirestoreUser = z.infer<typeof firestoreUserSchema>;
export type CreateFirestoreUser = z.infer<typeof createFirestoreUserSchema>; 