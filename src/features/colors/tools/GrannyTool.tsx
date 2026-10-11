import { useEffect, useMemo, useState } from 'react';
import { LayoutGrid, Lock, LockOpen, Shuffle } from 'lucide-react';
import type { YarnWeightId } from '@/types';
import { useLang, useMsgs } from '@/i18n';
import { Stepper, Switch, NumberInput } from '@/ui/Field';
import { Modal } from '@/ui/Modal';
import { Callout } from '@/ui/Callout';
import { useTerms } from '@/ui/Term';
import { COMMON } from '@/i18n/common';
import { YARN_WEIGHTS, typicalGauge } from '@/knowledge/yarnWeights';
import { nameColor } from '@/lib/color';
import { fmt, fmtMeters, letterFor } from '@/lib/format';
import { useLen, weightLabel } from '@/features/calculators/ui';
import { CLR } from '../i18n';
import { arrangeGranny, comboCounts, edgeClashes, grannyMetersByColor, grannySideCm, type GrannySquare } from '../logic';
import { useColorStudio } from '../store';
import { ColorList, ToolLayout } from '../ui';

/** Merkezden dışa iç içe kareler */
function SquareArt({ rounds, colors, size = 100 }: { rounds: number[]; colors: string[]; size?: number }) {
  const n = rounds.length;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden className="cs-sq-art">
      {[...rounds]
        .map((c, k) => ({ c, k }))
        .reverse()
        .map(({ c, k }) => {
          const inset = ((n - 1 - k) / n) * 44 + 2;
          return (
            <rect
              key={k}
              x={inset}
              y={inset}
              width={100 - inset * 2}
              height={100 - inset * 2}
              rx={k === 0 ? 10 : 4}
              fill={colors[c] ?? '#ccc'}
              stroke="rgba(0,0,0,.18)"
              strokeWidth="1"
            />
          );
        })}
      {/* trabzan kümelerini andıran kesik çizgiler */}
      {rounds.map((_, k) => {
        const inset = ((n - 1 - k) / n) * 44 + 2 + 44 / n / 2;
        return (
          <rect
            key={`s${k}`}
            x={inset}
            y={inset}
            width={100 - inset * 2}
            height={100 - inset * 2}
            fill="none"
            stroke="rgba(255,255,255,.35)"
            strokeWidth="1.2"
            strokeDasharray="3 2"
          />
        );
      })}
    </svg>
  );
}

/** Izgara boyutu değişince kareleri (satır, sütun) konumuna göre taşır */
function remap(old: GrannySquare[], oldCols: number, cols: number, rows: number): GrannySquare[] {
  const out: GrannySquare[] = [];
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const o = x < oldCols ? old[y * oldCols + x] : undefined;
      out.push(o ?? { rounds: [], locked: false });
    }
  return out;
}

export default function GrannyTool() {
  const t = useMsgs(CLR);
  const c = useMsgs(COMMON);
  const lang = useLang();
  const terms = useTerms();
  const len = useLen();
  const g = useColorStudio((s) => s.granny);
  const set = useColorStudio((s) => s.setGranny);
  const [edit, setEdit] = useState<number | null>(null);
  const total = g.cols * g.rows;

  // geçersiz durumda (ilk açılış, renk silme) yeniden diz
  const valid = g.squares.length === total && g.squares.every((s) => s.rounds.length === g.rounds && s.rounds.every((r) => r >= 0 && r < g.colors.length));
  useEffect(() => {
    if (!valid)
      set({
        squares: arrangeGranny(g.cols, g.rows, g.colors.length, g.rounds, g.squares.length === total ? g.squares : [], g.seed),
      });
  }, [valid, g.cols, g.rows, g.colors.length, g.rounds, g.seed, g.squares, total, set]);

  const squares = valid ? g.squares : [];
  const clashes = useMemo(() => (valid ? edgeClashes(squares, g.cols, g.rows) : 0), [valid, squares, g.cols, g.rows]);
  const combos = useMemo(() => comboCounts(squares), [squares]);
  const gauge = typicalGauge(g.weight, 'crochet', 'dc');
  const meters = useMemo(() => grannyMetersByColor(squares, g.colors.length, gauge), [squares, g.colors.length, gauge]);
  const side = grannySideCm(g.rounds, gauge);
  const anyLocked = squares.some((s) => s.locked);

  const shuffle = () => {
    const seed = g.seed + 1;
    set({
      seed,
      squares: arrangeGranny(g.cols, g.rows, g.colors.length, g.rounds, squares, seed),
    });
  };
  const resize = (cols: number, rows: number) => {
    const moved = remap(squares, g.cols, cols, rows);
    set({
      cols,
      rows,
      squares: arrangeGranny(cols, rows, g.colors.length, g.rounds, moved, g.seed),
    });
  };
  const updateSquare = (i: number, patch: Partial<GrannySquare>) => set({ squares: squares.map((s, j) => (j === i ? { ...s, ...patch } : s)) });

  return (
    <ToolLayout id="granny" icon={<LayoutGrid />}>
      <div className="cs-grid cs-grid-preview">
        <section className="card stack cs-controls">
          <div className="cs-two">
            <div className="field">
              <span className="label">{t.gr.cols}</span>
              <Stepper value={g.cols} min={2} max={16} onChange={(cols) => resize(cols, g.rows)} ariaLabel={t.gr.cols} />
            </div>
            <div className="field">
              <span className="label">{t.gr.rows}</span>
              <Stepper value={g.rows} min={2} max={20} onChange={(rows) => resize(g.cols, rows)} ariaLabel={t.gr.rows} />
            </div>
          </div>
          <div className="field">
            <span className="label">{t.gr.rounds}</span>
            <Stepper
              value={g.rounds}
              min={1}
              max={4}
              onChange={(rounds) =>
                set({
                  rounds,
                  squares: arrangeGranny(g.cols, g.rows, g.colors.length, rounds, squares, g.seed),
                })
              }
              ariaLabel={t.gr.rounds}
            />
          </div>
          <div className="field">
            <span className="label">{t.colors}</span>
            <ColorList colors={g.colors} onChange={(colors) => set({ colors })} max={10} />
          </div>
          <div className="row">
            <button type="button" className="btn btn-primary" onClick={shuffle}>
              <Shuffle />
              {t.gr.shuffle}
            </button>
            {anyLocked && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() =>
                  set({
                    squares: squares.map((s) => ({ ...s, locked: false })),
                  })
                }
              >
                <LockOpen />
                {t.gr.unlockAll}
              </button>
            )}
          </div>
          <p className={`small ${clashes ? '' : 'muted'}`} style={{ margin: 0, color: clashes ? 'var(--warning)' : undefined }}>
            {clashes ? t.gr.clashes(clashes) : t.gr.clashFree}
          </p>
        </section>

        <section className="card stack cs-preview-card">
          <div className="cs-granny" style={{ gridTemplateColumns: `repeat(${g.cols}, minmax(0, 1fr))` }}>
            {squares.map((s, i) => (
              <button
                key={i}
                type="button"
                className={`cs-sq${s.locked ? ' locked' : ''}`}
                onClick={() => setEdit(i)}
                aria-label={`${t.gr.square(Math.floor(i / g.cols) + 1, (i % g.cols) + 1)}: ${s.rounds.map((r) => letterFor(r)).join(', ')}`}
              >
                <SquareArt rounds={s.rounds} colors={g.colors} size={100} />
                {s.locked && (
                  <span className="cs-sq-lock" aria-hidden>
                    <Lock />
                  </span>
                )}
              </button>
            ))}
          </div>
          <span className="hint">{t.gr.tapHint}</span>
        </section>

        <section className="card stack">
          <h2 className="card-title">{t.gr.combos}</h2>
          <ul className="cs-combos">
            {combos.map((cb) => (
              <li key={cb.rounds.join('-')}>
                <SquareArt rounds={cb.rounds} colors={g.colors} size={40} />
                <span className="grow small">
                  <strong className="mono">{cb.rounds.map((r) => letterFor(r)).join(' · ')}</strong>
                </span>
                <span className="chip">{t.gr.nSquares(cb.count)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card stack">
          <h2 className="card-title">{t.gr.yarn}</h2>
          <div className="cs-two">
            <div className="field">
              <label className="label" htmlFor="gr-weight">
                {t.yarnWeight}
              </label>
              <select id="gr-weight" className="select" value={g.weight} onChange={(e) => set({ weight: Number(e.target.value) as YarnWeightId })}>
                {YARN_WEIGHTS.map((w) => (
                  <option key={w.id} value={w.id}>
                    {weightLabel(w, lang)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="gr-skein">
                {t.skeinLength}
              </label>
              <NumberInput id="gr-skein" min={1} value={g.skeinM} onChange={(skeinM) => set({ skeinM })} suffix="m" />
            </div>
          </div>
          <p className="small muted" style={{ margin: 0 }}>
            {t.gr.squareSize(len(side, 0))} · {t.gr.blanketSize(len(side * g.cols, 0), len(side * g.rows, 0))} · {t.gr.nSquares(total)}
          </p>
          <ul className="list">
            {g.colors.map((hex, i) => (
              <li key={i} className="spread">
                <span className="row-nowrap">
                  <span className="swatch" style={{ background: hex }} aria-hidden />
                  <strong>{letterFor(i)}</strong> {nameColor(hex, lang)}
                </span>
                <span className="tabular small">
                  {fmtMeters(meters[i] ?? 0, lang)} · {t.skeins(fmt(Math.ceil(((meters[i] ?? 0) / g.skeinM) * 10) / 10, 1, lang))}
                </span>
              </li>
            ))}
          </ul>
          <p className="hint" style={{ margin: 0 }}>
            {terms.fill(t.gr.yarnNote)}
          </p>
          <Callout tone="prof">{t.gr.tip}</Callout>
        </section>
      </div>

      <Modal
        open={edit !== null}
        onClose={() => setEdit(null)}
        title={edit !== null ? t.gr.square(Math.floor(edit / g.cols) + 1, (edit % g.cols) + 1) : t.gr.edit}
        footer={
          <button type="button" className="btn btn-primary" onClick={() => setEdit(null)}>
            {c.done}
          </button>
        }
      >
        {edit !== null && squares[edit] && (
          <div className="stack">
            <div className="center" style={{ display: 'grid', placeItems: 'center' }}>
              <SquareArt rounds={squares[edit].rounds} colors={g.colors} size={120} />
            </div>
            {squares[edit].rounds.map((rc, k) => (
              <div key={k} className="field">
                <span className="label">{t.gr.round(k + 1, g.rounds)}</span>
                <div className="row" role="radiogroup" aria-label={t.gr.round(k + 1, g.rounds)} style={{ gap: 6 }}>
                  {g.colors.map((hex, ci) => (
                    <button
                      key={ci}
                      type="button"
                      role="radio"
                      aria-checked={rc === ci}
                      className="swatch swatch-lg"
                      style={{ background: hex }}
                      aria-pressed={rc === ci}
                      aria-label={`${letterFor(ci)} · ${nameColor(hex, lang)}`}
                      onClick={() =>
                        updateSquare(edit, {
                          rounds: squares[edit].rounds.map((x, j) => (j === k ? ci : x)),
                          locked: true,
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
            <Switch checked={squares[edit].locked} onChange={(locked) => updateSquare(edit, { locked })} label={t.gr.lock} hint={t.gr.lockHint} />
          </div>
        )}
      </Modal>
    </ToolLayout>
  );
}
