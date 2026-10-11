import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookA, Check, Clock, Lock, Scissors, SquareStack } from 'lucide-react';
import { LEVELS, LESSON_BY_ID, PATHS, lessonHref, lessonTitle, levelOf, type PathId } from '@/knowledge/curriculum';
import { useProgress, streakOf } from '@/store/progress';
import { usePro } from '@/store/pro';
import { useTerms } from '@/ui/Term';
import { PageHeader } from '@/ui/PageHeader';
import { YarnBall } from '@/ui/YarnBall';
import { ProgressRing } from '@/ui/ProgressRing';
import { useMsgs } from '@/i18n';
import { LEARN } from './i18n';
import './learn.css';

const PATH_KEY = 'ilmek.secilenYol';

export default function HomePage() {
  const t = useMsgs(LEARN);
  const terms = useTerms();
  const lang = terms.lang;
  const done = useProgress((s) => s.done);
  const last = useProgress((s) => s.lastLesson);
  const days = useProgress((s) => s.days);
  const pro = usePro((s) => s.pro);
  const [path, setPath] = useState<PathId>(() => {
    try {
      return (localStorage.getItem(PATH_KEY) as PathId) || 'hazirlik';
    } catch {
      return 'hazirlik';
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(PATH_KEY, path);
    } catch {
      /* yoksay */
    }
  }, [path]);

  const pathLessons = (p: PathId) => LEVELS.filter((l) => l.path === p).flatMap((l) => l.lessons);
  const nextFor = (p: PathId) => pathLessons(p).find((l) => !done[l.id]);
  const continueId = last && !done[last] ? last : last ? (nextFor(LESSON_BY_ID[last]?.path ?? 'hazirlik')?.id ?? last) : 'haz-malzemeler';
  const cont = LESSON_BY_ID[continueId];
  const contLevel = levelOf(continueId);
  const streak = streakOf(days);
  const current = nextFor(path)?.id;

  return (
    <div className="page">
      <PageHeader eyebrow={t.homeEyebrow} title={t.homeTitle} lede={t.homeLede} />

      <div className="learn-hero">
        <Link to={lessonHref(continueId)} className="card card-link continue-card">
          <ProgressRing value={contLevel ? contLevel.lessons.filter((l) => done[l.id]).length / contLevel.lessons.length : 0} size={74} stroke={7}>
            <YarnBall color={PATHS.find((p) => p.id === cont?.path)?.color ?? '#b5523b'} size={44} tail={false} />
          </ProgressRing>
          <div className="grow">
            <div className="eyebrow" style={{ fontSize: '1.1rem' }}>
              {last ? t.continueTitle : t.startHere}
            </div>
            <h3>{cont ? lessonTitle(cont, terms.ctx) : ''}</h3>
            <div className="small muted">{last ? cont?.subtitle[lang] : t.startHereText}</div>
          </div>
          <ArrowRight />
        </Link>
        <div className="card">
          <div className="spread" style={{ marginBottom: 'var(--space-3)' }}>
            <span className="label">{t.paths}</span>
            <span className="chip" data-tone="mustard">
              {t.streak(streak)}
            </span>
          </div>
          <div className="path-pick" role="group" aria-label={t.paths}>
            {PATHS.map((p) => {
              const all = pathLessons(p.id);
              const n = all.filter((l) => done[l.id]).length;
              return (
                <button key={p.id} aria-pressed={path === p.id} onClick={() => setPath(p.id)} style={{ ['--pc' as string]: p.color }}>
                  <YarnBall color={p.color} size={38} tail={false} amount={0.4 + 0.6 * (n / all.length)} />
                  {p.title[lang]}
                  <span className="sub">{t.lessonsDone(n, all.length)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {LEVELS.filter((l) => l.path === path).map((level) => {
        const pc = PATHS.find((p) => p.id === level.path)!.color;
        const lockedLevel = !level.free && !pro;
        const n = level.lessons.filter((l) => done[l.id]).length;
        return (
          <section key={level.id} className="path-level" style={{ ['--path-color' as string]: pc }}>
            <div className="path-level-head">
              <div>
                <div className="eyebrow" style={{ color: pc }}>
                  {t.level(level.n)}
                </div>
                <h3>{level.title[lang]}</h3>
                <p className="muted">{level.desc[lang]}</p>
              </div>
              <div className="row">
                <span className="chip" data-tone={level.free ? 'sage' : 'mustard'}>
                  {level.free ? t.freeLevel : t.proLevel}
                </span>
                <span className="chip">{t.lessonsDone(n, level.lessons.length)}</span>
              </div>
            </div>
            <div className="path-track">
              {level.lessons.map((ls, k) => {
                const isDone = !!done[ls.id];
                const state = isDone ? 'done' : lockedLevel ? 'locked' : ls.id === current ? 'current' : 'open';
                return (
                  <Link key={ls.id} to={lessonHref(ls.id)} className="path-node" data-state={state}>
                    <span className="path-node-ball">
                      <YarnBall color={pc} size={46} tail={false} amount={isDone ? 1 : 0.55} />
                      {isDone && (
                        <span className="check">
                          <Check />
                        </span>
                      )}
                    </span>
                    <span>
                      <span className="path-node-title">
                        {k + 1}. {lessonTitle(ls, terms.ctx)}
                      </span>
                      <br />
                      <span className="path-node-sub">{ls.subtitle[lang]}</span>
                    </span>
                    <span className="path-node-meta">
                      {state === 'locked' ? (
                        <Lock aria-label={t.locked} />
                      ) : (
                        <>
                          <Clock aria-hidden />
                          {t.minutes(ls.minutes)}
                        </>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="grid-3" style={{ marginTop: 'var(--space-5)' }}>
        <Link to="/yarat" className="card card-link card-kraft">
          <Scissors />
          <div className="card-title" style={{ marginTop: 8 }}>
            {t.goCreate}
          </div>
          <p className="small" style={{ margin: 0 }}>
            {t.goCreateText}
          </p>
        </Link>
        <Link to="/desenler" className="card card-link">
          <SquareStack />
          <div className="card-title" style={{ marginTop: 8 }}>
            {t.libraryCard}
          </div>
          <p className="small muted" style={{ margin: 0 }}>
            {t.libraryText}
          </p>
        </Link>
        <Link to="/sozluk" className="card card-link">
          <BookA />
          <div className="card-title" style={{ marginTop: 8 }}>
            {t.glossaryCard}
          </div>
          <p className="small muted" style={{ margin: 0 }}>
            {t.glossaryText}
          </p>
        </Link>
      </div>
    </div>
  );
}
