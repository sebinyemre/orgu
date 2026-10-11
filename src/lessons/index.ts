/** Ders içerik kayıt defteri: her ders ayrı dosyadan isteğe bağlı yüklenir */
import type { Lesson } from './types';

type Loader = () => Promise<{ default: Lesson }>;

const LOADERS: Record<string, Loader> = import.meta.glob<{ default: Lesson }>('./content/*.tsx') as unknown as Record<string, Loader>;

const BY_ID: Record<string, Loader> = Object.fromEntries(
  Object.entries(LOADERS).map(([path, loader]) => [path.replace('./content/', '').replace('.tsx', ''), loader]),
);

export function hasLesson(id: string): boolean {
  return id in BY_ID;
}

export async function loadLesson(id: string): Promise<Lesson | null> {
  const loader = BY_ID[id];
  if (!loader) return null;
  return (await loader()).default;
}

export const AVAILABLE_LESSONS = Object.keys(BY_ID);
