import { useEffect, useState, useSyncExternalStore } from 'react';
import { loadPhoto } from '@/lib/photos';

const photoCache = new Map<string, string>();

/** IndexedDB'deki fotoğrafı (data URL) yükler; önbellekten anında döner. */
export function usePhoto(id: string | undefined): string | undefined {
  const [src, setSrc] = useState<string | undefined>(() => (id ? photoCache.get(id) : undefined));
  useEffect(() => {
    if (!id) {
      setSrc(undefined);
      return;
    }
    const hit = photoCache.get(id);
    if (hit) {
      setSrc(hit);
      return;
    }
    let alive = true;
    loadPhoto(id)
      .then((d) => {
        if (d) photoCache.set(id, d);
        if (alive) setSrc(d);
      })
      .catch(() => alive && setSrc(undefined));
    return () => {
      alive = false;
    };
  }, [id]);
  return src;
}

export function forgetPhoto(id: string): void {
  photoCache.delete(id);
}

/** CSS medya sorgusu */
export function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Etkinken her saniye yenilenen "şimdi" */
export function useNow(active: boolean, ms = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [active, ms]);
  return active ? now : Date.now();
}
