import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Lock, Pause, Play, RotateCcw, X } from 'lucide-react';
import { LESSON_BY_ID, lessonHref, lessonTitle, levelOf, nextLesson } from '@/knowledge/curriculum';
import { loadLesson } from '@/lessons';
import type { Lesson } from '@/lessons/types';
import { Scene, type SceneHandle } from '@/engine/illust/Scene';
import { NeedIcon } from '@/engine/illust/tools';
import { useProgress } from '@/store/progress';
import { usePro } from '@/store/pro';
import { useSettings } from '@/store/settings';
import { useTerms } from '@/ui/Term';
import { Callout } from '@/ui/Callout';
import { ProgressRing } from '@/ui/ProgressRing';
import { YarnBall } from '@/ui/YarnBall';
import { clickSound, vibrate } from '@/lib/device';
import { useMsgs } from '@/i18n';
import { LEARN } from './i18n';
import './learn.css';

type Phase = 'intro' | 'step' | 'practice' | 'quiz' | 'done';

export default function LessonPage() {
  const { lessonId = '' } = useParams();
  const nav = useNavigate();
  const t = useMsgs(LEARN);
  const terms = useTerms();
  const meta = LESSON_BY_ID[lessonId];
  const level = levelOf(lessonId);
  const pro = usePro((s) => s.pro);
  const locked = !!level && !level.free && !pro;
  const progress = useProgress();
  const [lesson, setLesson] = useState<Lesson | null | undefined>(undefined);
  const [phase, setPhase] = useState<Phase>('intro');
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const sceneRef = useRef<SceneHandle>(null);

  useEffect(() => {
    let alive = true;
    setLesson(undefined);
    setPhase('intro');
    setI(0);
    loadLesson(lessonId).then((l) => alive && setLesson(l));
    return () => {
      alive = false;
    };
  }, [lessonId]);

  const steps = lesson?.steps ?? [];
  const segments = steps.length + (lesson?.practice ? 1 : 0) + (lesson?.quiz?.length ? 1 : 0);
  const segIndex = phase === 'intro' ? -1 : phase === 'step' ? i : phase === 'practice' ? steps.length : phase === 'quiz' ? steps.length + (lesson?.practice ? 1 : 0) : segments;

  const finish = useCallback(() => {
    progress.complete(lessonId);
    setPhase('done');
  }, [lessonId, progress]);

  const goNext = useCallback(() => {
    if (!lesson) return;
    if (phase === 'intro') {
      setPhase('step');
      setI(0);
      progress.visit(lessonId, 0);
      return;
    }
    if (phase === 'step') {
      if (i < steps.length - 1) {
        setI(i + 1);
        progress.visit(lessonId, i + 1);
        setPaused(false);
      } else if (lesson.practice) setPhase('practice');
      else if (lesson.quiz?.length) setPhase('quiz');
      else finish();
      return;
    }
    if (phase === 'practice') {
      if (lesson.quiz?.length) setPhase('quiz');
      else finish();
      return;
    }
    if (phase === 'quiz') finish();
  }, [lesson, phase, i, steps.length, lessonId, progress, finish]);

  const goPrev = useCallback(() => {
    if (phase === 'step') {
      if (i > 0) setI(i - 1);
      else setPhase('intro');
    } else if (phase === 'practice') {
      setPhase('step');
      setI(steps.length - 1);
    } else if (phase === 'quiz') {
      if (lesson?.practice) setPhase('practice');
      else {
        setPhase('step');
        setI(steps.length - 1);
      }
    }
  }, [phase, i, steps.length, lesson]);

  // klavye
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') nav('/');
      else if (e.key === ' ' && phase === 'step') {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, nav, phase]);

  // kaydırma
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    touch.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = touch.current;
    touch.current = null;
    if (!s || phase !== 'step') return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? goNext : goPrev)();
  };

  if (!meta) {
    return (
      <div className="lesson">
        <div className="lesson-empty">
          <Link to="/" className="btn btn-primary">
            {t.backToPath}
          </Link>
        </div>
      </div>
    );
  }

  const title = lessonTitle(meta, terms.ctx);
  const lang = terms.lang;
  const next = nextLesson(lessonId);

  return (
    <div className="lesson" data-path={meta.path}>
      <header className="lesson-top">
        <Link to="/" className="btn btn-ghost btn-icon" aria-label={t.close}>
          <X />
        </Link>
        <div className="lesson-bar" aria-hidden>
          {Array.from({ length: Math.max(1, segments) }, (_, k) => (
            <span key={k} data-on={k <= segIndex} />
          ))}
        </div>
        <span className="lesson-count tabular">{phase === 'step' ? t.stepOf(i + 1, steps.length) : ''}</span>
      </header>

      {locked ? (
        <div className="lesson-empty">
          <div className="lesson-lock">
            <Lock />
          </div>
          <h2>{t.lockedTitle}</h2>
          <p className="muted">{t.lockedText}</p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <Link to="/pro" className="btn btn-primary">
              {t.seePro}
            </Link>
            <Link to="/" className="btn">
              {t.backToPath}
            </Link>
          </div>
        </div>
      ) : lesson === undefined ? (
        <div className="lesson-empty">
          <YarnBall color="#b5523b" size={56} tail={false} />
        </div>
      ) : lesson === null ? (
        <div className="lesson-empty">
          <YarnBall color="#d39a2c" size={72} />
          <h2>{title}</h2>
          <p className="muted">{meta.subtitle[lang]}</p>
          <div className="hand" style={{ fontSize: '1.5rem' }}>
            {t.preparing}
          </div>
          <p className="muted small">{t.preparingText}</p>
          <Link to="/" className="btn btn-primary">
            {t.backToPath}
          </Link>
        </div>
      ) : phase === 'intro' ? (
        <div className="lesson-body lesson-intro-wrap">
        <div className="lesson-intro">
          <div className="eyebrow">{level ? t.level(level.n) : ''}</div>
          <h1>{title}</h1>
          <p className="lesson-lede">{terms.fill(lesson.intro[lang])}</p>
          <div className="chip" data-tone="denim" style={{ alignSelf: 'flex-start' }}>
            {t.minutes(meta.minutes)}
          </div>
          {lesson.needs?.length ? (
            <section className="lesson-needs">
              <h3>{t.needs}</h3>
              <ul>
                {lesson.needs.map((n, k) => (
                  <li key={k}>
                    <NeedIcon kind={n.kind} />
                    <span>{n.text[lang]}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <div className="lesson-actions">
            <button className="btn btn-primary btn-lg" onClick={goNext}>
              {t.start} <ArrowRight />
            </button>
          </div>
        </div>
          {steps.length > 0 && (
            // dersin sonunda varılacak yer: son adımın çizimi
            <figure className="lesson-intro-preview" aria-hidden>
              <Scene dur={steps[steps.length - 1].dur ?? 3.4} viewBox={steps[steps.length - 1].viewBox}>
                {steps[steps.length - 1].scene()}
              </Scene>
            </figure>
          )}
        </div>
      ) : phase === 'step' ? (
        <StepView
          lesson={lesson}
          i={i}
          paused={paused}
          sceneRef={sceneRef}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        />
      ) : phase === 'practice' && lesson.practice ? (
        <Practice lessonId={lessonId} practice={lesson.practice} onDone={goNext} />
      ) : phase === 'quiz' && lesson.quiz ? (
        <Quiz lesson={lesson} onDone={finish} />
      ) : (
        <div className="lesson-body lesson-done">
          <ProgressRing value={1} size={96} stroke={9}>
            <Check size={40} color="var(--success)" />
          </ProgressRing>
          <h1>{t.doneTitle}</h1>
          <p className="muted">{title}</p>
          {lesson.summary?.length ? (
            <section className="card card-stitched" style={{ textAlign: 'left', width: '100%', maxWidth: 520 }}>
              <div className="eyebrow">{t.keyPoints}</div>
              <ul className="list">
                {lesson.summary.map((s, k) => (
                  <li key={k}>{terms.fill(s[lang])}</li>
                ))}
              </ul>
            </section>
          ) : null}
          <div className="row" style={{ justifyContent: 'center' }}>
            {next && (
              <button className="btn btn-primary btn-lg" onClick={() => nav(lessonHref(next.id))}>
                {t.nextLesson}: {lessonTitle(next, terms.ctx)} <ArrowRight />
              </button>
            )}
            <Link to="/" className="btn btn-lg">
              {t.backToPath}
            </Link>
          </div>
        </div>
      )}

      {phase === 'step' && lesson && !locked && (
        <footer className="lesson-nav">
          <button className="btn btn-lg" onClick={goPrev} aria-label={t.prev}>
            <ArrowLeft />
            <span className="hide-sm">{t.prev}</span>
          </button>
          <div className="row-nowrap">
            <button className="btn btn-ghost btn-icon btn-lg" onClick={() => setPaused((p) => !p)} aria-label={paused ? t.play : t.pause}>
              {paused ? <Play /> : <Pause />}
            </button>
            <button
              className="btn btn-ghost btn-icon btn-lg"
              onClick={() => {
                sceneRef.current?.restart();
                setPaused(false);
              }}
              aria-label={t.replay}
            >
              <RotateCcw />
            </button>
          </div>
          <button className="btn btn-primary btn-lg" onClick={goNext}>
            <span className="hide-sm">{t.next}</span>
            <ArrowRight />
          </button>
        </footer>
      )}
    </div>
  );
}

function StepView({
  lesson,
  i,
  paused,
  sceneRef,
  onPointerDown,
  onPointerUp,
}: {
  lesson: Lesson;
  i: number;
  paused: boolean;
  sceneRef: React.RefObject<SceneHandle | null>;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
}) {
  const t = useMsgs(LEARN);
  const terms = useTerms();
  const lang = terms.lang;
  const step = lesson.steps[i];
  const speed = useSettings((s) => s.animSpeed);
  return (
    <div className="lesson-body lesson-step" key={i}>
      <div className="lesson-figure" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <Scene ref={sceneRef} dur={(step.dur ?? 3.4) * 1} paused={paused} viewBox={step.viewBox} label={step.title[lang]} key={`${i}-${speed}`}>
          {step.scene()}
        </Scene>
        {step.loopsOnHook !== undefined && (
          <span className="lesson-loops chip" data-tone="denim">
            {t.loopsOnHook(step.loopsOnHook)}
          </span>
        )}
      </div>
      <div className="lesson-text">
        <h2>{terms.fill(step.title[lang])}</h2>
        <p>{terms.fill(step.text[lang])}</p>
        {step.tip && <Callout tone="prof">{terms.fill(step.tip[lang])}</Callout>}
        {step.warn && (
          <Callout tone="warn" className="lesson-warn">
            {terms.fill(step.warn[lang])}
          </Callout>
        )}
      </div>
    </div>
  );
}

function Practice({ lessonId, practice, onDone }: { lessonId: string; practice: NonNullable<Lesson['practice']>; onDone: () => void }) {
  const t = useMsgs(LEARN);
  const terms = useTerms();
  const n = useProgress((s) => s.practice[lessonId] ?? 0);
  const setN = useProgress((s) => s.setPractice);
  const sound = useSettings((s) => s.counterSound);
  const vib = useSettings((s) => s.counterVibrate);
  const done = n >= practice.target;
  const tap = () => {
    setN(lessonId, n + 1);
    if (sound) clickSound(n + 1 >= practice.target ? 'ding' : 'tick');
    if (vib) vibrate(n + 1 >= practice.target ? [30, 50, 30] : 10);
  };
  return (
    <div className="lesson-body lesson-practice">
      <div className="eyebrow">{t.practiceTitle}</div>
      <p className="lesson-lede">{terms.fill(practice.text[terms.lang])}</p>
      <button className={`practice-tap${done ? ' is-done' : ''}`} onClick={tap} aria-label={t.practiceTap}>
        <ProgressRing value={Math.min(1, n / practice.target)} size={180} stroke={12}>
          <div>
            <div className="stat-value" style={{ fontSize: '2.6rem' }}>
              {t.practiceCount(n, practice.target)}
            </div>
            <div className="small muted">{t.practiceUnit[practice.unit]}</div>
          </div>
        </ProgressRing>
      </button>
      <div className="hint">{done ? t.practiceDone : t.practiceTap}</div>
      <div className="row" style={{ justifyContent: 'center' }}>
        <button className="btn btn-ghost" onClick={() => setN(lessonId, Math.max(0, n - 1))} aria-label="-1">
          −1
        </button>
        <button className={`btn ${done ? 'btn-primary' : ''} btn-lg`} onClick={onDone}>
          {done ? t.next : t.skip} <ArrowRight />
        </button>
      </div>
    </div>
  );
}

function Quiz({ lesson, onDone }: { lesson: Lesson; onDone: () => void }) {
  const t = useMsgs(LEARN);
  const terms = useTerms();
  const lang = terms.lang;
  const qs = lesson.quiz ?? [];
  const [k, setK] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const q = qs[k];
  const checked = pick !== null;
  const right = pick === q.answer;
  const order = useMemo(() => q.options.map((_, j) => j), [q]);
  return (
    <div className="lesson-body lesson-quiz">
      <div className="eyebrow">
        {t.quizTitle} · {k + 1}/{qs.length}
      </div>
      <h2>{terms.fill(q.q[lang])}</h2>
      {q.scene && (
        <div className="lesson-figure small-figure">
          <Scene still>{q.scene()}</Scene>
        </div>
      )}
      <div className="quiz-options">
        {order.map((j) => (
          <button
            key={j}
            className="quiz-option"
            data-state={checked ? (j === q.answer ? 'right' : j === pick ? 'wrong' : 'idle') : 'idle'}
            onClick={() => !checked && setPick(j)}
            disabled={checked}
          >
            {terms.fill(q.options[j][lang])}
          </button>
        ))}
      </div>
      {checked && (
        <Callout tone={right ? 'tip' : 'warn'} title={right ? t.correct : t.wrong}>
          {q.explain ? terms.fill(q.explain[lang]) : null}
        </Callout>
      )}
      {checked && (
        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            if (k < qs.length - 1) {
              setK(k + 1);
              setPick(null);
            } else onDone();
          }}
        >
          {t.next} <ArrowRight />
        </button>
      )}
    </div>
  );
}
