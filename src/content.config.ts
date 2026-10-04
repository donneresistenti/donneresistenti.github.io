import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      place: z.string(),
      period: z.string(),
      excerpt: z.string(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      order: z.number().default(0),
      draft: z.boolean().default(false),
    }),
});

export const collections = { stories };
