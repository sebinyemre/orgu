/** Geliştirme sayfası: çizim motorunu görsel olarak denemek için (yalnızca geliştirmede).
 * ?still durağan kareler, ?ders=<id> bir dersin tüm adımları */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Scene } from '@/engine/illust/Scene';
import { BindOffScene, LadderScene, SwatchScene, TurnScene, WeaveScene, swatchRows } from '@/engine/illust/swatch';
import { NeedleGaugeScene, ToolsBoardScene, YarnLabelScene, YarnWeightsScene } from '@/engine/illust/info';
import { loadLesson } from '@/lessons';
import { AmiBallScene, JoinScene, PostScene, TunisianScene } from '@/engine/illust/crochet2';
import { CLOSEUP_VIEW, LoopsCloseUpScene } from '@/engine/illust/closeup';
import { MagicRingScene } from '@/engine/illust/scenes';
import { CrochetScene } from '@/engine/illust/crochet';
import { CableScene, ColorworkBack, ColorworkFront, GaugeScene, TwoColorScene } from '@/engine/illust/texture';
import { KnitScene } from '@/engine/illust/knit';
import { CircularScene, DpnScene, HatScene, MagicLoopScene } from '@/engine/illust/round';
import { ChartReadScene, Diagram, RoundBadges, chainRowMarks, circleMarks, fanMarks, grannyMarks, spiralMarks, ROUND_COLORS } from '@/engine/illust/diagram';
import type { Lesson } from '@/lessons/types';
import { useTerms } from '@/ui/Term';

const ROUND_STATES: { title: string; el: React.ReactNode }[] = [
  { title: 'circ cast', el: <CircularScene phase="cast" /> },
  { title: 'circ twisted', el: <CircularScene phase="twisted" /> },
  { title: 'circ join', el: <CircularScene phase="join" /> },
  { title: 'circ around', el: <CircularScene phase="around" /> },
  { title: 'ml split', el: <MagicLoopScene phase="split" /> },
  { title: 'ml pull', el: <MagicLoopScene phase="pull" /> },
  { title: 'ml knit', el: <MagicLoopScene phase="knit" /> },
  { title: 'dpn divide', el: <DpnScene phase="divide" /> },
  { title: 'dpn knit', el: <DpnScene phase="knit" /> },
  { title: 'hat all', el: <HatScene part="all" /> },
  { title: 'hat crown', el: <HatScene part="crown" /> },
  { title: 'hat close', el: <HatScene part="close" /> },
];

const TEX_STATES: { title: string; el: React.ReactNode }[] = [
  { title: 'cable slip', el: <CableScene phase="slip" /> },
  { title: 'cable hold', el: <CableScene phase="hold" /> },
  { title: 'cable fromCn', el: <CableScene phase="fromCn" /> },
  { title: 'cable result', el: <CableScene phase="result" /> },
  { title: 'cw front', el: <ColorworkFront /> },
  { title: 'cw back', el: <ColorworkBack catchLong /> },
  { title: 'two color', el: <TwoColorScene /> },
  { title: 'gauge st', el: <GaugeScene dir="st" count={9} /> },
  { title: 'gauge row', el: <GaugeScene dir="row" count={12} /> },
  { title: 'k2tog', el: <KnitScene left={5} right={2} rn="insertK2" target={[0, 1]} /> },
  { title: 'k2tog drop', el: <KnitScene left={5} right={2} rn="rest" newLoop="k" dropN={2} dropped /> },
  { title: 'tbl', el: <KnitScene left={4} right={2} rn="insertTbl" target /> },
  { title: 'yo', el: <KnitScene left={4} right={2} rn="rest" newLoop="yo" /> },
  { title: 'brioche', el: <KnitScene left={4} right={2} rn="insertK" leftYo target /> },
  { title: 'swatch lean', el: <SwatchScene rows={[['k','k','k','k','k','k','k','k'],['k','yo','k2tog','k','k','ssk','yo','k'],['k','k','k','k','k','k','k','k'],['p','sl','p','sl','p','sl','p','sl'],['p','none','p','none','p','none','p','none']]} /> },
];

const CRO_STATES: { title: string; el: React.ReactNode; vb?: string }[] = [
  { title: 'fpdc', el: <PostScene side="front" /> },
  { title: 'bpdc', el: <PostScene side="back" /> },
  { title: 'tss fwd', el: <TunisianScene pass="forward" /> },
  { title: 'tss ret', el: <TunisianScene pass="return" /> },
  { title: 'tss fabric', el: <TunisianScene pass="fabric" /> },
  { title: 'join slst', el: <JoinScene method="slst" /> },
  { title: 'join whip', el: <JoinScene method="whip" /> },
  { title: 'ami inc', el: <AmiBallScene phase="inc" /> },
  { title: 'ami even', el: <AmiBallScene phase="even" /> },
  { title: 'ami stuff', el: <AmiBallScene phase="stuff" /> },
  { title: 'ami close', el: <AmiBallScene phase="close" /> },
  { title: 'inv dec', el: <LoopsCloseUpScene part="front" count={2} />, vb: CLOSEUP_VIEW },
  { title: 'mr wrap', el: <MagicRingScene phase="wrap" /> },
  { title: 'mr insert', el: <MagicRingScene phase="insert" /> },
  { title: 'mr work', el: <MagicRingScene phase="work" count={4} /> },
  { title: 'mr close', el: <MagicRingScene phase="close" count={6} /> },
  { title: 'puff 7', el: <CrochetScene hook="pulled" loops={7} yo /> },
  { title: 'color change', el: <CrochetScene hook="pulled" loops={2} yo loopColors={['#e0a24a', '#e0a24a']} yarnColor="#b5523b" /> },
];

const STATES: { title: string; el: React.ReactNode; vb?: string }[] = [
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
  { title: 'circle', el: <Diagram marks={circleMarks({ rounds: 4 })} focus={4} extra={<RoundBadges rounds={4} />} /> },
  { title: 'circle dc', el: <Diagram marks={circleMarks({ rounds: 3, stitch: 'dc', start: 12, step: 42 })} /> },
  { title: 'spiral', el: <Diagram marks={spiralMarks({ rounds: 3 })} focus={3} /> },
  { title: 'granny', el: <Diagram marks={grannyMarks({ rounds: 3 })} /> },
  { title: 'shell', el: <Diagram marks={[...chainRowMarks(11, 230, 50, 30), ...fanMarks([140, 220], 5, 100, 'dc', 56, ROUND_COLORS[1], 1), ...fanMarks([290, 220], 5, 100, 'dc', 56, ROUND_COLORS[1], 1)]} /> },
  { title: 'chart', el: <ChartReadScene cells={[['k','k','p','k','k','p','k','k'],['p','k','k','p','k','k','p','k'],['k','yo','k2tog','k','k','yo','k2tog','k'],['k','k','k','k','k','k','k','k'],['p','p','k','k','p','p','k','k'],['k','k','k','k','k','k','k','k']]} row={3} /> },
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
  const set = q.get('set');
  const list: { title: string; el: React.ReactNode; vb?: string }[] = set === 'round' ? ROUND_STATES : set === 'tex' ? TEX_STATES : set === 'cro' ? CRO_STATES : STATES;
  return (
    <div className="page page-wide">
      <div className="grid-3">
        {list.map((s) => (
          <div key={s.title} className="card">
            <div className="card-title">{s.title}</div>
            <Scene still={still} viewBox={s.vb}>
              {s.el}
            </Scene>
          </div>
        ))}
      </div>
    </div>
  );
}
