import { z } from 'zod';

export const childProfileSchema = z.object({
  id: z.string(),
  parentId: z.string(),
  displayName: z.string().min(1).max(50),
  avatarConfig: z.string().optional(), // JSON string of avatar config
  age: z.number().min(3).max(18).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Game progress could be stored here or in a separate collection, 
  // but for simple stats, we can keep it here.
  totalStars: z.number().default(0),
  unlockedGames: z.array(z.string()).default(['simple-match', 'ocean-dash', 'pollution-patrol']),
});

export const createChildProfileSchema = z.object({
  displayName: z.string().min(1).max(50),
  age: z.number().min(3).max(18).optional(),
  avatarConfig: z.string().optional(),
});

export const updateChildProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  age: z.number().min(3).max(18).optional(),
  avatarConfig: z.string().optional(),
});

// Firestore document schema
export const firestoreChildProfileSchema = childProfileSchema.extend({
  createdAt: z.union([z.date(), z.any()]),
  updatedAt: z.union([z.date(), z.any()]),
});

export type ChildProfile = z.infer<typeof childProfileSchema>;
export type CreateChildProfile = z.infer<typeof createChildProfileSchema>;
export type UpdateChildProfile = z.infer<typeof updateChildProfileSchema>;
export type FirestoreChildProfile = z.infer<typeof firestoreChildProfileSchema>;
