import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Link2, Plus, Trash2 } from 'lucide-react';
import type { ChartDoc } from '@/types';
import { useStash } from '@/store/stash';
import { toast } from '@/store/toast';
import { YARN_SWATCHES } from '@/knowledge/swatches';
import { inkOn, nameColor } from '@/lib/color';
import { fmtMeters } from '@/lib/format';
import { Modal } from '@/ui/Modal';
import { Tabs } from '@/ui/Tabs';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { colorCounts } from '@/engine/chart/grid';
import { metersForStitches } from '@/engine/math/yarn';
import { CH } from '../i18n';
import { addColor, moveColor, pickColor, recolor, removeColor, renameColor, useEditor } from './state';

type AddSrc = 'swatch' | 'stash' | 'custom';

export function ColorsPanel({ meta }: { meta: Pick<ChartDoc, 'craft' | 'gauge'> }) {
  const t = useMsgs(CH);
  const c = useMsgs(COMMON);
  const lang = useLang();
  const palette = useEditor((s) => s.doc.palette);
  const color = useEditor((s) => s.color);
  const paint = useEditor((s) => s.paint);
  const rev = useEditor((s) => s.rev);
  const doc = useEditor((s) => s.doc);
  const yarns = useStash((s) => s.yarns);
  const [adding, setAdding] = useState(false);
  const [src, setSrc] = useState<AddSrc>('swatch');
  const [custom, setCustom] = useState('#7d4e6d');
  const [toDelete, setToDelete] = useState<number | null>(null);

  // sayımlar işlem bitince (rev) yenilenir; hücreler yerinde değiştiği için doc kimliği yetmez
  const counts = useMemo(() => colorCounts(doc, palette.length), [rev, doc, palette.length]);
  const gauge = meta.gauge ?? (meta.craft === 'knit' ? { stitches: 22, rows: 30 } : { stitches: 18, rows: 20 });
  const kind = meta.craft === 'knit' ? 'knit' : 'sc';
  const meters = (n: number) => metersForStitches(n, gauge, kind);

  const add = (hex: string, name: string, yarnId?: string) => {
    if (!addColor(hex, name, yarnId)) toast(t.maxColors);
    else setAdding(false);
  };

  const remove = (i: number) => {
    if (palette.length <= 1) return;
    if (!counts.counts[i]) removeColor(i, -1);
    else setToDelete(i);
  };

  return (
    <div className="stack chart-colors">
      <ul className="chart-palette" aria-label={t.tabColors}>
        {palette.map((p, i) => {
          const active = color === i && paint !== 'symbol';
          return (
            <li key={p.id} className="chart-pal-row" data-active={active}>
              <button type="button" className="chart-pal-swatch" style={{ background: p.hex, color: inkOn(p.hex) }} aria-pressed={active} aria-label={`${p.letter} · ${p.name}`} onClick={() => pickColor(i)}>
                {p.letter}
              </button>
              <div className="chart-pal-main">
                <input className="chart-pal-name" value={p.name} onChange={(e) => renameColor(i, e.target.value)} aria-label={`${t.colorName} ${p.letter}`} maxLength={60} />
                <div className="chart-pal-meta">
                  {p.yarnId && (
                    <span title={t.linkedYarn} aria-label={t.linkedYarn}>
                      <Link2 size={12} />
                    </span>
                  )}
                  <span>{t.stitchCount(counts.counts[i] ?? 0)}</span>
                  {counts.counts[i] > 0 && <span>{t.meters(meters(counts.counts[i]) < 1 ? '< 1 m' : fmtMeters(meters(counts.counts[i]), lang))}</span>}
                </div>
              </div>
              <div className="chart-pal-actions">
                <input type="color" className="chart-pal-picker" value={p.hex} onChange={(e) => recolor(i, e.target.value)} aria-label={`${c.customColor} ${p.letter}`} />
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => moveColor(i, -1)} disabled={i === 0} aria-label={t.moveUp} title={t.moveUp}>
                  <ChevronUp />
                </button>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => moveColor(i, 1)} disabled={i === palette.length - 1} aria-label={t.moveDown} title={t.moveDown}>
                  <ChevronDown />
                </button>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => remove(i)} disabled={palette.length <= 1} aria-label={t.removeColor} title={t.removeColor}>
                  <Trash2 />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {counts.empty > 0 && palette.length > 0 && (
        <p className="xsmall faint" style={{ margin: 0 }}>
          {t.emptyCells(counts.empty)}. {t.emptyIsA(palette[0].letter)}
        </p>
      )}

      {!adding ? (
        <button className="btn btn-soft btn-sm" onClick={() => setAdding(true)} disabled={palette.length >= 26} style={{ alignSelf: 'flex-start' }}>
          <Plus /> {t.addColor}
        </button>
      ) : (
        <div className="card card-sunken chart-add-color">
          <Tabs<AddSrc>
            value={src}
            onChange={setSrc}
            label={t.addColor}
            tabs={[
              { id: 'swatch', label: t.fromSwatches },
              { id: 'stash', label: t.fromStash },
              { id: 'custom', label: t.customColor },
            ]}
          />
          {src === 'swatch' && (
            <div className="chart-swatch-grid">
              {YARN_SWATCHES.map((s) => (
                <button key={s.hex} type="button" className="swatch swatch-lg" style={{ background: s.hex }} aria-label={s.name[lang]} title={s.name[lang]} onClick={() => add(s.hex, s.name[lang])} />
              ))}
            </div>
          )}
          {src === 'stash' &&
            (yarns.length ? (
              <ul className="chart-stash-list">
                {yarns.map((y) => (
                  <li key={y.id}>
                    <button type="button" className="chart-stash-item" onClick={() => add(y.colorHex, y.colorName || `${y.brand} ${y.name}`.trim(), y.id)}>
                      <span className="swatch" style={{ background: y.colorHex }} />
                      <span className="grow">
                        <span style={{ fontWeight: 700 }}>{y.colorName || y.name}</span>
                        <span className="xsmall faint" style={{ display: 'block' }}>
                          {[y.brand, y.name].filter(Boolean).join(' · ')}
                        </span>
                      </span>
                      <Plus size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="small muted">{t.noStash}</p>
            ))}
          {src === 'custom' && (
            <div className="row">
              <input type="color" className="input" value={custom} onChange={(e) => setCustom(e.target.value)} aria-label={t.customColor} />
              <span className="small">{nameColor(custom, lang)}</span>
              <button className="btn btn-primary btn-sm" onClick={() => add(custom, nameColor(custom, lang))}>
                <Plus /> {c.add}
              </button>
            </div>
          )}
          <div className="row" style={{ justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setAdding(false)}>
              {c.cancel}
            </button>
          </div>
        </div>
      )}

      <p className="xsmall faint" style={{ margin: 0 }}>
        {t.metersNote}
      </p>

      {toDelete !== null && palette[toDelete] && (
        <Modal open onClose={() => setToDelete(null)} title={t.deleteColorTitle}>
          <p>{t.deleteColorText(palette[toDelete].letter, counts.counts[toDelete] ?? 0)}</p>
          <div className="field">
            <span className="label">{t.replaceWith}</span>
            <div className="row" style={{ gap: 6 }}>
              {palette.map((p, j) =>
                j === toDelete ? null : (
                  <button
                    key={p.id}
                    type="button"
                    className="chart-pal-swatch chart-pal-swatch-sm"
                    style={{ background: p.hex, color: inkOn(p.hex) }}
                    aria-label={`${p.letter} · ${p.name}`}
                    title={`${p.letter} · ${p.name}`}
                    onClick={() => {
                      removeColor(toDelete, j);
                      setToDelete(null);
                    }}
                  >
                    {p.letter}
                  </button>
                ),
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setToDelete(null)}>
              {c.cancel}
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                removeColor(toDelete, -1);
                setToDelete(null);
              }}
            >
              {t.leaveEmpty}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
