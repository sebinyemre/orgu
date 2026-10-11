/**
 * Yarat dünyasında bilinmeyen bir tekniği yerinde göstermek için bağlantı.
 * Dokununca alttan bir sayfa açılır ve o dersin resimli adımlarını gösterir; kullanıcı tariften çıkmaz.
 *
 *   <TechniqueLink lessonId="sis-eksiltme">kaydır-kaydır-ör</TechniqueLink>
 *   <TechniqueLink lessonId="tig-sihirli-halka" />   // metin verilmezse ders başlığı yazılır
 *
 * GEÇİCİ SÜRÜM: Dersler modülü bu bileşeni resimli adım oynatıcısıyla değiştirecek. Props sözleşmesi sabittir.
 */
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CircleHelp } from 'lucide-react';
import { Modal } from '@/ui/Modal';
import { LESSON_BY_ID, lessonHref, lessonTitle } from '@/knowledge/curriculum';
import { useTerms } from '@/ui/Term';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';

export interface TechniqueLinkProps {
  lessonId: string;
  children?: ReactNode;
  /** yalnızca küçük soru işareti düğmesi */
  iconOnly?: boolean;
}

export function TechniqueLink({ lessonId, children, iconOnly }: TechniqueLinkProps) {
  const [open, setOpen] = useState(false);
  const t = useMsgs(COMMON);
  const { ctx } = useTerms();
  const meta = LESSON_BY_ID[lessonId];
  if (!meta) return <>{children}</>;
  const title = lessonTitle(meta, ctx);
  return (
    <>
      <button type="button" className="technique-link" onClick={() => setOpen(true)} aria-label={`${t.howTo} ${title}`} title={t.howTo}>
        {!iconOnly && <span>{children ?? title}</span>}
        <CircleHelp aria-hidden />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        <p className="muted">{meta.subtitle[ctx.lang]}</p>
        <Link className="btn btn-primary" to={lessonHref(lessonId)} onClick={() => setOpen(false)}>
          {t.showMe}
        </Link>
      </Modal>
    </>
  );
}
