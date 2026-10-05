import { getCollection } from 'astro:content';

/** Storie pubblicate, ordinate per `order`. Le bozze sono visibili solo in sviluppo. */
export async function getStories() {
  const stories = await getCollection('stories', ({ data }) => import.meta.env.DEV || !data.draft);
  return stories.sort((a, b) => a.data.order - b.data.order);
}

/**
 * Proporzioni (larghezza/altezza) della copertina di una storia: quelle originali della foto,
 * oppure, se la copertina manca, un formato orizzontale simile a quello delle foto reali.
 */
export const coverRatio = (cover?: ImageMetadata) => (cover ? cover.width / cover.height : 1.1);
