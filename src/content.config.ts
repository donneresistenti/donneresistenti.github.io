import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const stories = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/stories' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      period: z.string(),
      excerpt: z.string(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      order: z.number().default(0),
      draft: z.boolean().default(false),

      /** Sezione "Cronologia": tappe della linea del tempo, nell'ordine in cui vanno mostrate. */
      timeline: z
        .array(
          z.object({
            date: z.string(),
            title: z.string(),
            text: z.string(),
            image: image().optional(),
            imageAlt: z.string().optional(),
          }),
        )
        .default([]),

      /** Sezione "Media": immagini (gestite da astro:assets) e audio (file in public/ o URL). */
      media: z
        .array(
          z.discriminatedUnion('type', [
            z.object({
              type: z.literal('image'),
              src: image(),
              alt: z.string(),
              caption: z.string().optional(),
              credit: z.string().optional(),
            }),
            z.object({
              type: z.literal('audio'),
              src: z.string(),
              title: z.string(),
              description: z.string().optional(),
              credit: z.string().optional(),
            }),
          ]),
        )
        .default([]),

      /** Sezione "Fonti": bibliografia e riferimenti, raggruppati per categoria se indicata. */
      sources: z
        .array(
          z.object({
            category: z.enum(['bibliografia', 'filmografia', 'sitografia']).optional(),
            title: z.string(),
            author: z.string().optional(),
            details: z.string().optional(),
            year: z.union([z.string(), z.number()]).optional(),
            url: z.url().optional(),
            /** Breve presentazione della fonte, mostrata sotto il riferimento. */
            description: z.string().optional(),
          }),
        )
        .default([]),
    }),
});

export const collections = { stories };
