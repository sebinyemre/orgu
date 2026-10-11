/**
 * Yarat dünyasında bilinmeyen bir tekniği yerinde göstermek için bağlantı.
 * Dokununca alttan bir sayfa açılır ve o dersin resimli adımlarını gösterir; kullanıcı tariften çıkmaz.
 *
 *   <TechniqueLink lessonId="sis-eksiltme">kaydır-kaydır-ör</TechniqueLink>
 *   <TechniqueLink lessonId="tig-sihirli-halka" />   // metin verilmezse ders başlığı yazılır
 */
import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CircleHelp, Lock } from 'lucide-react';
import { Modal } from '@/ui/Modal';
import { LESSON_BY_ID, lessonHref, lessonTitle, levelOf } from '@/knowledge/curriculum';
import { loadLesson } from '@/lessons';
import type { Lesson } from '@/lessons/types';
import { Scene } from '@/engine/illust/Scene';
import { useTerms } from '@/ui/Term';
import { usePro } from '@/store/pro';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { LEARN } from './i18n';
import './learn.css';

export interface TechniqueLinkProps {
  lessonId: string;
  children?: ReactNode;
  /** yalnızca küçük soru işareti düğmesi */
  iconOnly?: boolean;
}

export function TechniqueLink({ lessonId, children, iconOnly }: TechniqueLinkProps) {
  const [open, setOpen] = useState(false);
  const c = useMsgs(COMMON);
  const { ctx } = useTerms();
  const meta = LESSON_BY_ID[lessonId];
  if (!meta) return <>{children}</>;
  const title = lessonTitle(meta, ctx);
  return (
    <>
      <button type="button" className="technique-link" onClick={() => setOpen(true)} aria-label={`${c.howTo} ${title}`} title={c.howTo}>
        {!iconOnly && <span>{children ?? title}</span>}
        <CircleHelp aria-hidden />
      </button>
      {open && <TechniqueSheet lessonId={lessonId} onClose={() => setOpen(false)} />}
    </>
  );
}

/** Dersin resimli adımlarını kaydırmalı bir alt sayfada gösterir */
export function TechniqueSheet({ lessonId, onClose }: { lessonId: string; onClose: () => void }) {
  const t = useMsgs(LEARN);
  const terms = useTerms();
  const meta = LESSON_BY_ID[lessonId];
  const level = levelOf(lessonId);
  const pro = usePro((s) => s.pro);
  // Yarat dünyasında "nasıl yapılır" gösterimi her zaman açıktır; tam ders Usta paketine bağlı olabilir
  const fullLocked = !!level && !level.free && !pro;
  const [lesson, setLesson] = useState<Lesson | null | undefined>(undefined);
  const [i, setI] = useState(0);
  useEffect(() => {
    loadLesson(lessonId).then(setLesson);
  }, [lessonId]);
  const lang = terms.lang;
  const steps = lesson?.steps ?? [];
  const step = steps[i];
  return (
    <Modal open onClose={onClose} title={meta ? lessonTitle(meta, terms.ctx) : ''} wide>
      {lesson === undefined ? null : !lesson || !step ? (
        <div className="stack">
          <p className="muted">{meta?.subtitle[lang]}</p>
          <p className="small">{t.preparingText}</p>
        </div>
      ) : (
        <div className="stack">
          <div className="lesson-figure">
            <Scene dur={step.dur ?? 3.4} viewBox={step.viewBox} key={i}>
              {step.scene()}
            </Scene>
          </div>
          <div>
            <div className="spread">
              <h3 style={{ margin: 0 }}>{terms.fill(step.title[lang])}</h3>
              <span className="chip tabular">{t.stepOf(i + 1, steps.length)}</span>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 'var(--fs-lg)' }}>{terms.fill(step.text[lang])}</p>
          </div>
          <div className="spread">
            <button className="btn" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>
              <ArrowLeft /> {t.prev}
            </button>
            <button className="btn btn-primary" onClick={() => setI(Math.min(steps.length - 1, i + 1))} disabled={i >= steps.length - 1}>
              {t.next} <ArrowRight />
            </button>
          </div>
        </div>
      )}
      <div className="modal-footer" style={{ justifyContent: 'flex-start' }}>
        <Link to={fullLocked ? '/pro' : lessonHref(lessonId)} className="btn btn-ghost" onClick={onClose}>
          {fullLocked && <Lock />}
          {t.openLesson}
        </Link>
      </div>
    </Modal>
  );
}
