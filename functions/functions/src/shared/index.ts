// Types
export * from './types/common';

// Schemas
export * from './schemas/user';
export * from './schemas/child';
export * from './schemas/subscription';

// Utilities
export const createApiResponse = <T>(
  success: boolean,
  data?: T,
  error?: string,
  message?: string
) => ({
  success,
  data,
  error,
  message,
});

export const createErrorResponse = (error: string, message?: string) =>
  createApiResponse(false, undefined, error, message);

export const createSuccessResponse = <T>(data: T, message?: string) =>
  createApiResponse(true, data, undefined, message);
