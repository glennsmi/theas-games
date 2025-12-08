import { onRequest, onCall } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import cors from 'cors';
import {
  createSuccessResponse,
  createErrorResponse,
  User,
  userSchema,
  paginationSchema,
  COLLECTIONS,
  FirestoreUser
} from './shared';

// Export webhook
export * from './webhook';

// Set global options for all functions
setGlobalOptions({
  region: 'europe-west2',
  maxInstances: 10,
  timeoutSeconds: 300,
  memory: '512MiB'
});

// Initialize Firebase Admin
import { db } from './init';

// CORS configuration
const corsHandler = cors({ origin: true });

// Helper function to convert Firestore timestamp to Date
const convertTimestamps = (data: admin.firestore.DocumentData, id: string): User => {
  return {
    id,
    email: data.email,
    displayName: data.displayName,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
    isParentVerified: data.isParentVerified || false,
    subscription: data.subscription,
  };
};

// HTTP Function Example
export const helloWorld = onRequest((request, response) => {
  corsHandler(request, response, () => {
    try {
      const message = 'Hello from Firebase Functions v2 in Europe West 2!';
      const apiResponse = createSuccessResponse({ message }, 'Function executed successfully');

      response.json(apiResponse);
    } catch (error) {
      const errorResponse = createErrorResponse(
        'Internal server error',
        error instanceof Error ? error.message : 'Unknown error'
      );
      response.status(500).json(errorResponse);
    }
  });
});

// Callable Function Example with Firestore integration
export const getUsers = onCall(async (request) => {
  try {
    // Validate pagination parameters
    const paginationResult = paginationSchema.safeParse(request.data);

    if (!paginationResult.success) {
      return createErrorResponse('Invalid pagination parameters', paginationResult.error.message);
    }

    const { page, limit } = paginationResult.data;

    // Get users from Firestore
    const usersRef = db.collection(COLLECTIONS.USERS);
    const snapshot = await usersRef
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset((page - 1) * limit)
      .get();

    const users: User[] = [];
    snapshot.forEach(doc => {
      const userData = doc.data() as FirestoreUser;
      users.push(convertTimestamps(userData, doc.id));
    });

    // Get total count for pagination
    const totalSnapshot = await usersRef.count().get();
    const total = totalSnapshot.data().count;

    const response = createSuccessResponse(users, 'Users retrieved successfully');

    return {
      ...response,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    return createErrorResponse(
      'Failed to retrieve users',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
});

// Callable Function to create a user in Firestore
export const createUser = onCall(async (request) => {
  try {
    // Check if user is authenticated
    if (!request.auth) {
      return createErrorResponse('Authentication required', 'User must be logged in');
    }

    // Validate the user data using Zod schema
    const userData = userSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(request.data);

    const now = admin.firestore.FieldValue.serverTimestamp();
    const newUserData = {
      email: userData.email,
      displayName: userData.displayName,
      createdAt: now,
      updatedAt: now,
    };

    // Save to Firestore
    const docRef = await db.collection(COLLECTIONS.USERS).add(newUserData);
    const doc = await docRef.get();
    const createdUser = convertTimestamps(doc.data() as FirestoreUser, doc.id);

    return createSuccessResponse(createdUser, 'User created successfully');
  } catch (error) {
    return createErrorResponse(
      'Failed to create user',
      error instanceof Error ? error.message : 'Invalid user data'
    );
  }
});

// Callable Function to get current user profile
export const getCurrentUser = onCall(async (request) => {
  try {
    if (!request.auth) {
      return createErrorResponse('Authentication required', 'User must be logged in');
    }

    const userDoc = await db.collection(COLLECTIONS.USERS).doc(request.auth.uid).get();

    if (!userDoc.exists) {
      return createErrorResponse('User not found', 'User profile does not exist');
    }

    const userData = userDoc.data() as FirestoreUser;
    const user = convertTimestamps(userData, userDoc.id);

    return createSuccessResponse(user, 'User profile retrieved successfully');
  } catch (error) {
    return createErrorResponse(
      'Failed to retrieve user profile',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
});

// Callable Function to update user profile
export const updateUser = onCall(async (request) => {
  try {
    if (!request.auth) {
      return createErrorResponse('Authentication required', 'User must be logged in');
    }

    const updateData = userSchema.omit({ id: true, createdAt: true, updatedAt: true, email: true }).parse(request.data);

    const updatePayload = {
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection(COLLECTIONS.USERS).doc(request.auth.uid).update(updatePayload);

    // Get updated user
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(request.auth.uid).get();
    const userData = userDoc.data() as FirestoreUser;
    const user = convertTimestamps(userData, userDoc.id);

    return createSuccessResponse(user, 'User profile updated successfully');
  } catch (error) {
    return createErrorResponse(
      'Failed to update user profile',
      error instanceof Error ? error.message : 'Invalid user data'
    );
  }
});
