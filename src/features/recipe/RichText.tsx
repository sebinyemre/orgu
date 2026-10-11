/**
 * Tarif metnindeki [[dersId|metin]] ve [[dersId]] işaretlerini dokunulabilir TechniqueLink'e çevirir.
 */
import type { ReactNode } from 'react';
import { TechniqueLink } from '@/features/learn/TechniqueLink';

const RE = /\[\[([a-z0-9-]+)(?:\|([^\]]*))?\]\]/g;

export function RichText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(RE)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    out.push(
      <TechniqueLink key={k++} lessonId={m[1]}>
        {m[2] || undefined}
      </TechniqueLink>,
    );
    last = i + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/** Bağlantı işaretlerini temizlenmiş düz metin (arama, aria için) */
export function plainText(text: string): string {
  return text.replace(RE, (_, _id: string, t?: string) => t ?? '');
}
