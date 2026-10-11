import type { ComponentType, ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, LayoutGrid, Palette, Rainbow, ThermometerSun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { CLR } from './i18n';
import { DEFAULT_TEMP_COLORS } from './logic';
import type { ToolId } from './ui';
import PaletteTool from './tools/PaletteTool';
import StripeTool from './tools/StripeTool';
import TemperatureTool from './tools/TemperatureTool';
import GrannyTool from './tools/GrannyTool';
import './colors.css';

const TOOLS: ToolId[] = ['palet', 'serit', 'sicaklik', 'granny'];
const VIEWS: Record<ToolId, ComponentType> = {
  palet: PaletteTool,
  serit: StripeTool,
  sicaklik: TemperatureTool,
  granny: GrannyTool,
};
const ICONS: Record<ToolId, LucideIcon> = {
  palet: Palette,
  serit: Rainbow,
  sicaklik: ThermometerSun,
  granny: LayoutGrid,
};

/** Kart üstündeki küçük süs (ip renkleriyle) */
const ART: Record<ToolId, ReactNode> = {
  palet: (
    <span className="cs-art cs-art-pal">
      {['#b5523b', '#d39a2c', '#f5f0e6', '#5f7a61', '#46698a'].map((c) => (
        <span key={c} style={{ background: c }} />
      ))}
    </span>
  ),
  serit: (
    <span className="cs-art cs-art-str">
      {['#46698a', '#46698a', '#f5f0e6', '#d39a2c', '#d39a2c', '#d39a2c', '#b5523b', '#f5f0e6', '#46698a'].map((c, i) => (
        <span key={i} style={{ background: c }} />
      ))}
    </span>
  ),
  sicaklik: (
    <span className="cs-art cs-art-tmp">
      {DEFAULT_TEMP_COLORS.concat([...DEFAULT_TEMP_COLORS].reverse()).map((c, i) => (
        <span key={i} style={{ background: c }} />
      ))}
    </span>
  ),
  granny: (
    <span className="cs-art cs-art-gr">
      {[
        ['#f5f0e6', '#d39a2c', '#5f7a61'],
        ['#b5523b', '#f5f0e6', '#46698a'],
        ['#46698a', '#f4a7b9', '#d39a2c'],
        ['#5f7a61', '#b5523b', '#f5f0e6'],
      ].map((r, i) => (
        <span
          key={i}
          style={{
            background: r[2],
            boxShadow: `inset 0 0 0 6px ${r[2]}, inset 0 0 0 12px ${r[1]}, inset 0 0 0 30px ${r[0]}`,
          }}
        />
      ))}
    </span>
  ),
};

function Hub() {
  const t = useMsgs(CLR);
  const c = useMsgs(COMMON);
  return (
    <div className="page">
      <PageHeader eyebrow={t.hubEyebrow} title={c.navColors} lede={t.hubLede} />
      <div className="grid-2 cs-hub">
        {TOOLS.map((id) => {
          const Icon = ICONS[id];
          return (
            <Link key={id} to={`/renk/${id}`} className="card card-link card-flush cs-card">
              {ART[id]}
              <span className="cs-card-body">
                <span className="cs-card-icon" aria-hidden>
                  <Icon />
                </span>
                <span className="grow">
                  <span className="card-title">{t.tools[id].title}</span>
                  <span className="cs-card-desc">{t.tools[id].desc}</span>
                </span>
                <ArrowRight className="cs-card-arrow" aria-hidden />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function ColorStudioPage() {
  const { toolId } = useParams();
  const t = useMsgs(CLR);
  if (!toolId) return <Hub />;
  if (!(TOOLS as string[]).includes(toolId)) {
    return (
      <div className="page">
        <EmptyState
          title={t.notFound}
          action={
            <Link className="btn btn-primary" to="/renk">
              {t.back}
            </Link>
          }
        />
      </div>
    );
  }
  const View = VIEWS[toolId as ToolId];
  return <View key={toolId} />;
}
