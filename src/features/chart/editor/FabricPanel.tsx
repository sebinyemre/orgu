import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChartDoc } from '@/types';
import { Segmented } from '@/ui/Segmented';
import { Switch } from '@/ui/Field';
import { useMsgs } from '@/i18n';
import { extractRegion } from '@/engine/chart/grid';
import { FabricPreview } from '../FabricPreview';
import { useChartPrefs } from '../prefs';
import { CH } from '../i18n';
import { useEditor } from './state';

export function FabricPanel({ meta }: { meta: Pick<ChartDoc, 'craft' | 'name'> }) {
  const t = useMsgs(CH);
  const rev = useEditor((s) => s.rev);
  const doc = useEditor((s) => s.doc);
  const tile = useChartPrefs((s) => s.fabricTile);
  const onlyRepeat = useChartPrefs((s) => s.fabricOnlyRepeat);
  const zoom = useChartPrefs((s) => s.fabricZoom);
  const set = useChartPrefs((s) => s.set);
  const useRep = onlyRepeat && !!doc.repeat;
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxW, setBoxW] = useState(320);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBoxW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // işlem bitince (rev) kopyalanır; sürükleme sırasında önizleme yeniden çizilmez
  const src = useMemo(() => {
    if (useRep && doc.repeat) return extractRegion(doc, doc.repeat);
    return { width: doc.width, height: doc.height, colors: doc.colors.slice(), symbols: doc.symbols.slice() };
  }, [rev, doc, useRep]);

  const fitPx = (boxW - 24) / Math.max(1, src.width * tile);
  const stitch = Math.max(3, Math.min(56, Math.floor(fitPx * zoom)));

  return (
    <div className="stack chart-fabric-panel">
      <div className="chart-fabric-box" ref={boxRef}>
        <FabricPreview
          width={src.width}
          height={src.height}
          symbols={src.symbols}
          colors={src.colors}
          palette={doc.palette}
          craft={meta.craft}
          tileX={tile}
          tileY={tile}
          stitchPx={stitch}
          ariaLabel={`${t.fabricTitle}: ${meta.name}`}
        />
      </div>
      <p className="xsmall faint" style={{ margin: 0 }}>
        {t.fabricHint}
      </p>
      <div className="row">
        <span className="label">{t.tile}</span>
        <Segmented<1 | 2 | 3>
          value={tile}
          onChange={(v) => set({ fabricTile: v })}
          label={t.tile}
          options={[
            { value: 1, label: t.tileOne },
            { value: 2, label: '2 × 2' },
            { value: 3, label: '3 × 3' },
          ]}
        />
      </div>
      {doc.repeat && <Switch checked={onlyRepeat} onChange={(v) => set({ fabricOnlyRepeat: v })} label={t.onlyRepeat} />}
      <label className="field">
        <span className="label">{t.stitchSize}</span>
        <input type="range" min={0.4} max={3} step={0.1} value={zoom} onChange={(e) => set({ fabricZoom: +e.target.value })} />
      </label>
    </div>
  );
}
