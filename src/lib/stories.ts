import { getCollection } from 'astro:content';

/** Storie pubblicate, ordinate per `order`. Le bozze sono visibili solo in sviluppo. */
export async function getStories() {
  const stories = await getCollection('stories', ({ data }) => import.meta.env.DEV || !data.draft);
  return stories.sort((a, b) => a.data.order - b.data.order);
}
