/**
 * Percorso di un file in public/ (es. `media/storia/audio.mp3`) relativo al `base` del sito.
 * Gli URL assoluti (https://…) restano invariati.
 */
export function withBase(path: string) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return base + path.replace(/^\/+/, '');
}
