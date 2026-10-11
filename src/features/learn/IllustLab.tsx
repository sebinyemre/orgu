/** Geliştirme sayfası: çizim motorunu görsel olarak denemek için (yalnızca geliştirmede).
 * ?still durağan kareler, ?ders=<id> bir dersin tüm adımları */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Scene } from '@/engine/illust/Scene';
import { BindOffScene, LadderScene, SwatchScene, TurnScene, WeaveScene, swatchRows } from '@/engine/illust/swatch';
import { NeedleGaugeScene, ToolsBoardScene, YarnLabelScene, YarnWeightsScene } from '@/engine/illust/info';
import { loadLesson } from '@/lessons';
import type { Lesson } from '@/lessons/types';
import { useTerms } from '@/ui/Term';

const STATES: { title: string; el: React.ReactNode }[] = [
  { title: 'jarse', el: <SwatchScene rows={swatchRows('jarse')} /> },
  { title: 'haraşo', el: <SwatchScene rows={swatchRows('haraso')} /> },
  { title: 'lastik 2x2', el: <SwatchScene rows={swatchRows('lastik2')} /> },
  { title: 'pirinç', el: <SwatchScene rows={swatchRows('pirinc')} /> },
  { title: 'yalancı', el: <SwatchScene rows={swatchRows('yalanci', 13)} cell={26} /> },
  { title: 'bind lift', el: <BindOffScene phase="lift" /> },
  { title: 'ladder pull', el: <LadderScene phase="hook" /> },
  { title: 'weave', el: <WeaveScene phase="weave" /> },
  { title: 'turn', el: <TurnScene /> },
  { title: 'tools', el: <ToolsBoardScene kinds={['needles', 'hook', 'yarn', 'scissors', 'tapestry', 'markers', 'tape', 'counter']} highlight={['needles', 'hook']} /> },
  { title: 'label', el: <YarnLabelScene highlight="needle" /> },
  { title: 'gauge', el: <NeedleGaugeScene highlight={5} /> },
  { title: 'weights', el: <YarnWeightsScene highlight={4} /> },
];

function LessonSteps({ id, still }: { id: string; still: boolean }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const { fill, ctx } = useTerms();
  useEffect(() => {
    void loadLesson(id).then(setLesson);
  }, [id]);
  if (!lesson) return <div className="page">…</div>;
  return (
    <div className="page page-wide">
      <div className="grid-3">
        {lesson.steps.map((s, i) => (
          <div key={i} className="card">
            <div className="card-title">
              {i + 1}. {fill(s.title[ctx.lang])} {s.loopsOnHook ? `(${s.loopsOnHook})` : ''}
            </div>
            <Scene still={still} dur={s.dur} viewBox={s.viewBox}>
              {s.scene()}
            </Scene>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IllustLab() {
  const q = new URLSearchParams(useLocation().search);
  const still = q.has('still');
  const ders = q.get('ders');
  if (ders) return <LessonSteps id={ders} still={still} />;
  return (
    <div className="page page-wide">
      <div className="grid-3">
        {STATES.map((s) => (
          <div key={s.title} className="card">
            <div className="card-title">{s.title}</div>
            <Scene still={still}>{s.el}</Scene>
          </div>
        ))}
      </div>
    </div>
  );
}
