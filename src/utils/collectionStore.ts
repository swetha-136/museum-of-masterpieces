import { Artwork, ARTWORKS_DATA } from '../data/museumData';

const STORAGE_KEY = 'museum_favourite_artworks';
const NOTES_KEY = 'museum_curator_notes';

type ChangeListener = () => void;
const listeners = new Set<ChangeListener>();

export function getFavouriteIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : ['mona-lisa', 'starry-night']; // default curatorial selection
  } catch {
    return ['mona-lisa', 'starry-night'];
  }
}

export function isFavourite(id: string): boolean {
  return getFavouriteIds().includes(id);
}

export function toggleFavourite(id: string): boolean {
  const current = getFavouriteIds();
  const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // fallback
  }
  listeners.forEach(fn => fn());
  return next.includes(id);
}

export function getFavouriteArtworks(): Artwork[] {
  const ids = getFavouriteIds();
  return ARTWORKS_DATA.filter(art => ids.includes(art.id));
}

export function getArtworkNotes(id: string): string {
  try {
    const raw = localStorage.getItem(`${NOTES_KEY}_${id}`);
    return raw || '';
  } catch {
    return '';
  }
}

export function saveArtworkNotes(id: string, notes: string) {
  try {
    localStorage.setItem(`${NOTES_KEY}_${id}`, notes);
  } catch {
    // ignore
  }
  listeners.forEach(fn => fn());
}

export function subscribeToCollection(fn: ChangeListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
