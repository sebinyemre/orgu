/**
 * Usta paketi (ücretli seviyeler) yetkisi.
 * Web sürümünde satın alma henüz bağlı değil; mobil uygulamada mağaza ödemesi (Google Play / App Store)
 * bu deponun `unlock` eylemini çağıracak. Şimdilik hediye kodu ile açılabilir.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProState {
  pro: boolean;
  since?: number;
  source?: 'store' | 'code';
  unlock: (source: 'store' | 'code') => void;
  lock: () => void;
}

export const usePro = create<ProState>()(
  persist(
    (set) => ({
      pro: false,
      unlock: (source) => set({ pro: true, since: Date.now(), source }),
      lock: () => set({ pro: false, since: undefined, source: undefined }),
    }),
    { name: 'ilmek.usta', version: 1 },
  ),
);

/** Hediye kodu doğrulaması (basit, istemci tarafı; gerçek satışta sunucu doğrulaması gerekir) */
export function checkGiftCode(code: string): boolean {
  const c = code.trim().toUpperCase().replace(/\s+/g, '');
  // İLMEK-xxxx biçimi ve basit sağlama toplamı
  const m = /^ILMEK-?([A-Z0-9]{4})$/.exec(c.replace('İ', 'I'));
  if (!m) return false;
  const sum = [...m[1]].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  return sum % 7 === 3;
}
