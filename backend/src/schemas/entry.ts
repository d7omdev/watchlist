import { z } from 'zod';

export const createEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  type: z.enum(['Movie', 'TV Show'], { message: 'Type must be Movie or TV Show' }),
  director: z.string().min(1, 'Director is required').max(255, 'Director name too long'),
  budget: z.string().min(1, 'Budget is required').max(100, 'Budget too long'),
  location: z.string().min(1, 'Location is required').max(255, 'Location too long'),
  duration: z.string().min(1, 'Duration is required').max(100, 'Duration too long'),
  yearTime: z.string().min(1, 'Year/Time is required').max(100, 'Year/Time too long'),
  description: z.string().optional(),
});

export const updateEntrySchema = createEntrySchema.partial();

export const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;
export type QueryInput = z.infer<typeof querySchema>;