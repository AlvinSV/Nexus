import { requireAuth } from '@clerk/express';

// Use this on any route that needs authentication
export const protect = requireAuth();