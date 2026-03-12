// lib/db.ts
// This file is now deprecated. Use lib/supabase.ts instead.

// For backward compatibility during migration, we'll export a mock object
// In a real app, you'd remove this file once all references are updated
export const db = {
  product: {
    findMany: async () => [],
    findUnique: async () => null,
    count: async () => 0,
  },
  user: {
    findUnique: async () => null,
  },
  order: {
    create: async () => null,
    findMany: async () => [],
    findUnique: async () => null,
  }
};