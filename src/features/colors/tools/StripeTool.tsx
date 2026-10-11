import { useMemo, useRef, useState } from 'react';
import { Download, Rainbow, Shuffle } from 'lucide-react';
import { useLang, useMsgs } from '@/i18n';
import { NumberInput, Stepper } from '@/ui/Field';
import { Callout } from '@/ui/Callout';
import { nameColor } from '@/lib/color';
import { letterFor } from '@/lib/format';
import { downloadCanvas } from '@/lib/download';
import { CLR } from '../i18n';
import { countBy, parseSequence, runsOf, stripeRows, type StripeMode } from '../logic';
import { useColorStudio } from '../store';
import { drawKnit, rowsToCells } from '../fabric';
import { ChipSelect, ColorList, KnitCanvas, ToolLayout, fmtPct } from '../ui';

const MODES: StripeMode[] = ['random', 'fibonacci', 'gradient', 'custom'];
const COLS = 30;
const LIST_LIMIT = 14;

export default function StripeTool() {
  const t = useMsgs(CLR);
  const lang = useLang();
  const s = useColorStudio((x) => x.stripe);
  const set = useColorStudio((x) => x.setStripe);
  const [showAll, setShowAll] = useState(false);
  const exportRef = useRef<HTMLCanvasElement | null>(null);

  const rows = useMemo(() => stripeRows(s), [s]);
  const runs = useMemo(() => runsOf(rows), [rows]);
  const counts = useMemo(() => countBy(rows, s.colors.length), [rows, s.colors.length]);
  const rowColors = rows.map((i) => s.colors[i] ?? '#cccccc');
  const cells = rowsToCells(rowColors, COLS);
  const seqOk = s.mode !== 'custom' || parseSequence(s.custom, s.colors.length).length > 0;
  const shownRuns = showAll ? runs : runs.slice(0, LIST_LIMIT);

  const exportPng = () => {
    const c = exportRef.current ?? document.createElement('canvas');
    exportRef.current = c;
    drawKnit(c, { cells, cols: COLS, rows: rows.length, stW: 16 }, 1);
    downloadCanvas(c, `${t.str.file}.png`);
  };

  return (
    <ToolLayout id="serit" icon={<Rainbow />}>
      <div className="cs-grid cs-grid-preview">
        <section className="card stack cs-controls">
          <div className="field">
            <span className="label">{t.colors}</span>
            <ColorList colors={s.colors} onChange={(colors) => set({ colors })} />
          </div>
          <div className="field">
            <span className="label">{t.str.mode}</span>
            <ChipSelect<StripeMode> label={t.str.mode} value={s.mode} onChange={(mode) => set({ mode })} options={MODES.map((m) => ({ value: m, label: t.str.modes[m] }))} />
            <span className="hint">{t.str.modeHints[s.mode]}</span>
          </div>
          {s.mode === 'custom' && (
            <div className="field">
              <label className="label" htmlFor="cs-seq">
                {t.str.sequence}
              </label>
              <input id="cs-seq" className="input mono" value={s.custom} placeholder={t.str.sequencePh} onChange={(e) => set({ custom: e.target.value })} />
              {!seqOk && (
                <span className="hint" style={{ color: 'var(--danger)' }}>
                  {t.str.sequenceError}
                </span>
              )}
            </div>
          )}
          <div className="cs-two">
            {s.mode !== 'custom' && (
              <div className="field">
                <span className="label">{t.str.unitRows}</span>
                <Stepper value={s.unitRows} min={1} max={20} onChange={(unitRows) => set({ unitRows })} ariaLabel={t.str.unitRows} />
              </div>
            )}
            <div className="field">
              <label className="label" htmlFor="cs-total">
                {t.str.totalRows}
              </label>
              <NumberInput id="cs-total" integer min={1} max={2000} value={s.totalRows} onChange={(totalRows) => set({ totalRows })} />
            </div>
          </div>
          <div className="row">
            {s.mode === 'random' && (
              <button type="button" className="btn btn-soft" onClick={() => set({ seed: s.seed + 1 })}>
                <Shuffle />
                {t.str.regenerate}
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={exportPng}>
              <Download />
              {t.str.exportPng}
            </button>
          </div>
          <div className="cs-sep" />
          <div className="label">{t.str.perColor}</div>
          <ul className="cs-bars">
            {s.colors.map((hex, i) => (
              <li key={i}>
                <span className="cs-bar-label">
                  <span className="swatch" style={{ background: hex }} aria-hidden /> {letterFor(i)} · {nameColor(hex, lang)}
                </span>
                <span className="cs-bar">
                  <span
                    style={{
                      width: `${(counts[i] / Math.max(1, rows.length)) * 100}%`,
                      background: hex,
                    }}
                  />
                </span>
                <span className="small tabular">
                  {t.str.nRows(counts[i])} · {fmtPct((counts[i] / Math.max(1, rows.length)) * 100, lang)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card stack cs-preview-card">
          <h2 className="card-title">{t.str.preview}</h2>
          <div className="cs-preview-scroll">
            <KnitCanvas className="cs-knit" ariaLabel={t.str.preview} cells={cells} cols={COLS} rows={rows.length} stW={10} />
          </div>
        </section>

        <section className="card stack">
          <h2 className="card-title">{t.str.rowList}</h2>
          <ol className="cs-runs">
            {shownRuns.map((r, i) => (
              <li key={i}>
                <span className="cs-run-swatch" style={{ background: s.colors[r.color] }} aria-hidden>
                  {letterFor(r.color)}
                </span>
                <span className="grow">
                  <strong>{t.str.rowRange(r.from, r.to)}</strong>
                  <span className="muted"> · {nameColor(s.colors[r.color], lang)}</span>
                </span>
                <span className="faint small">{t.str.nRows(r.to - r.from + 1)}</span>
              </li>
            ))}
          </ol>
          {runs.length > LIST_LIMIT && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAll((v) => !v)}>
              {showAll ? t.str.showLess : t.str.showAll(runs.length)}
            </button>
          )}
          <Callout tone="prof">{t.str.tip}</Callout>
        </section>
      </div>
    </ToolLayout>
  );
}
