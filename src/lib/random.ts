/**
 * Generatore pseudo-casuale deterministico (mulberry32): le forme "fatte a mano"
 * (pennellate, bordi strappati) restano identiche tra una build e l'altra.
 */
export function createRandom(seed: number) {
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const range = (min: number, max: number) => min + next() * (max - min);
  return { next, range };
}

export const round = (n: number) => Math.round(n * 10) / 10;
