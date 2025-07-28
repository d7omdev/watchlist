import { z } from 'zod';

export const entryFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  type: z.enum(['Movie', 'TV Show'], { message: 'Type must be Movie or TV Show' }),
  director: z.string().min(1, 'Director is required').max(255, 'Director name too long'),
  budget: z.string()
    .min(1, 'Budget is required')
    .max(100, 'Budget too long')
    .regex(
      /^\$?(\d+(?:,\d{3})*(?:\.\d+)?)\s*([KMB]?)|^(Low|Medium|High|Unknown|TBD|N\/A)$/i,
      'Budget must be in format like $1M, $100K, $1.5B, or text like "Low", "High", etc.'
    ),
  location: z.string().min(1, 'Location is required').max(255, 'Location too long'),
  duration: z.string().min(1, 'Duration is required').max(100, 'Duration too long'),
  yearTime: z.string().min(1, 'Year/Time is required').max(100, 'Year/Time too long'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type EntryFormData = z.infer<typeof entryFormSchema>;