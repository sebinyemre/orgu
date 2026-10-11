/** Geliştirme sayfası: çizim motorunu görsel olarak denemek için (yalnızca geliştirmede) */
import { Scene } from '@/engine/illust/Scene';
import { KnitScene, knitArrows } from '@/engine/illust/knit';
import { CrochetScene, crochetArrows } from '@/engine/illust/crochet';

const STATES: { title: string; el: React.ReactNode }[] = [
  { title: '1 bat', el: <KnitScene left={4} right={2} rn="insertK" rnFrom="rest" target arrows={knitArrows.insertK()} /> },
  { title: '2 sar', el: <KnitScene left={4} right={2} rn="insertK" wrap="k" wrapDraw={[0.15, 0.7]} arrows={knitArrows.wrapK()} /> },
  { title: '3 çek', el: <KnitScene left={4} right={2} rn="pullK" rnFrom="insertK" newLoop="k" arrows={knitArrows.pullK()} /> },
  { title: '4 düşür', el: <KnitScene left={4} right={2} rn="rest" newLoop="k" dropping={[0.2, 0.6]} arrows={knitArrows.drop()} /> },
  { title: 'tığ: bat', el: <CrochetScene hook="inserted" hookFrom="up" loops={1} target arrows={crochetArrows.insert()} /> },
  { title: 'tığ: ip at', el: <CrochetScene hook="inserted" loops={1} yo yoDraw={[0.1, 0.6]} arrows={crochetArrows.yo()} /> },
  { title: 'tığ: çek', el: <CrochetScene hook="pulled" hookFrom="inserted" loops={2} pulledLoop loopColors={['#5f8f9a', '#e0a24a']} arrows={crochetArrows.pullUp()} /> },
  { title: 'tığ: 2 ilmekten geçir', el: <CrochetScene hook="pulled" loops={2} yo pulledLoop through={{ n: 3, at: [0.2, 0.6] }} loopColors={['#5f8f9a', '#e0a24a']} arrows={crochetArrows.through()} /> },
  { title: 'zincir', el: <CrochetScene hook="chain" work="chain" loops={1} yo chainCount={6} arrows={crochetArrows.through(2)} /> },
];

export default function IllustLab() {
  return (
    <div className="page page-wide">
      <div className="grid-3">
        {STATES.map((s) => (
          <div key={s.title} className="card">
            <div className="card-title">{s.title}</div>
            <Scene still={new URLSearchParams(location.hash.split('?')[1] ?? '').has('still')}>{s.el}</Scene>
          </div>
        ))}
      </div>
    </div>
  );
}
