/** Desen kartındaki küçük kumaş önizlemesi (grafik tekrarı döşenerek) */
import { useMemo } from 'react';
import { FabricPreview } from '@/features/chart/FabricPreview';
import { patternChartCells, type StitchPattern } from '@/knowledge/stitchPatterns';

const YARN: Record<string, string> = {
  temel: '#e3cfae',
  lastik: '#c9b6d3',
  doku: '#bcd0b6',
  ajur: '#f2d6c9',
  burgu: '#e6d3a3',
  selanik: '#b9cbe0',
  'tig-temel': '#f0c9b8',
  'tig-doku': '#cfe0d6',
};

export function PatternThumb({ p, label, stitchPx = 9 }: { p: StitchPattern; label: string; stitchPx?: number }) {
  const cells = useMemo(() => patternChartCells(p), [p]);
  if (!cells) return <div className="lib-thumb lib-thumb-empty" aria-hidden />;
  // kartı dolduracak kadar döşe (fazlası kırpılır)
  const tileX = Math.min(12, Math.ceil(48 / cells.width));
  const tileY = Math.min(16, Math.ceil(18 / cells.height));
  return (
    <div className="lib-thumb">
      <FabricPreview
        width={cells.width}
        height={cells.height}
        symbols={cells.symbols}
        craft={p.craft}
        yarnColor={YARN[p.category] ?? '#e3cfae'}
        tileX={tileX}
        tileY={tileY}
        stitchPx={stitchPx}
        ariaLabel={label}
      />
    </div>
  );
}
