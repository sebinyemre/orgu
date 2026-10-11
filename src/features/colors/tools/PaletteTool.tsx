import { useMemo, useState } from 'react';
import { Palette, RotateCcw, Save, Trash2 } from 'lucide-react';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { Switch } from '@/ui/Field';
import { ColorPicker } from '@/ui/ColorPicker';
import { Callout } from '@/ui/Callout';
import { confirmDialog } from '@/ui/Confirm';
import { toast } from '@/store/toast';
import { grayValue, harmonies, inkOn, nameColor, toGrayHex } from '@/lib/color';
import { fmt, letterFor } from '@/lib/format';
import { CLR } from '../i18n';
import { contrastPairs } from '../logic';
import { useColorStudio, type HarmonyId } from '../store';
import { ChipSelect, ColorEditModal, KnitCanvas, StashColors, ToolLayout } from '../ui';

const HARMONIES: HarmonyId[] = ['tamamlayici', 'komsu', 'uclu', 'bolunmus', 'tonlar'];

/** Küçük renkli örgü motifi (8 ilmek genişliğinde tekrar, üstten alta) */
const MOTIF = ['#.#.#.#.', '........', '...#....', '..###...', '.##.##..', '##...##.', '.##.##..', '..###...', '...#....', '........', '.#.#.#.#'];

function motifCells(a: string, b: string, repeats = 3): string[] {
  const out: string[] = [];
  for (const row of MOTIF) for (let r = 0; r < repeats; r++) for (const ch of row) out.push(ch === '#' ? b : a);
  return out;
}

export default function PaletteTool() {
  const t = useMsgs(CLR);
  const c = useMsgs(COMMON);
  const lang = useLang();
  const draft = useColorStudio((s) => s.draft);
  const setDraft = useColorStudio((s) => s.setDraft);
  const palettes = useColorStudio((s) => s.palettes);
  const savePalette = useColorStudio((s) => s.savePalette);
  const removePalette = useColorStudio((s) => s.removePalette);
  const [gray, setGray] = useState(false);
  const [edit, setEdit] = useState<number | null>(null);
  const [pair, setPair] = useState<[number, number]>([0, 1]);
  const [name, setName] = useState('');

  const generated = useMemo(() => harmonies(draft.base)[draft.harmony], [draft.base, draft.harmony]);
  const colors = draft.colors.length ? draft.colors : generated;
  const pairs = useMemo(() => contrastPairs(colors), [colors]);
  const [pa, pb] = [colors[pair[0]] ?? colors[0], colors[pair[1]] ?? colors[1] ?? colors[0]];

  const pickBase = (hex: string) => setDraft({ base: hex, colors: [] });
  const pickHarmony = (h: HarmonyId) => setDraft({ harmony: h, colors: [] });
  const setColor = (i: number, hex: string) => setDraft({ colors: colors.map((x, j) => (j === i ? hex : x)) });
  const save = () => {
    const n = name.trim() || t.pal.defaultName(palettes.length + 1);
    savePalette(n, colors);
    setName('');
    toast(t.pal.savedToast);
  };

  return (
    <ToolLayout id="palet" icon={<Palette />}>
      <div className="cs-grid">
        <section className="card stack">
          <div className="field">
            <span className="label">{t.pal.base}</span>
            <ColorPicker value={draft.base} onChange={pickBase} label={t.pal.base} />
          </div>
          <StashColors value={draft.base} onPick={pickBase} />
          <div className="field">
            <span className="label">{t.pal.harmony}</span>
            <ChipSelect<HarmonyId>
              label={t.pal.harmony}
              value={draft.harmony}
              onChange={pickHarmony}
              options={HARMONIES.map((h) => ({
                value: h,
                label: t.pal.harmonies[h],
              }))}
            />
            <span className="hint">{t.pal.hints[draft.harmony]}</span>
          </div>
        </section>

        <section className="card stack">
          <div className="spread">
            <h2 className="card-title">{t.pal.palette}</h2>
            {draft.colors.length > 0 && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDraft({ colors: [] })}>
                <RotateCcw />
                {t.pal.restore}
              </button>
            )}
          </div>
          <div className="cs-pal">
            {colors.map((hex, i) => {
              const shown = gray ? toGrayHex(hex) : hex;
              return (
                <button
                  key={i}
                  type="button"
                  className="cs-pal-tile"
                  style={{ background: shown, color: inkOn(shown) }}
                  onClick={() => setEdit(i)}
                  aria-label={`${t.editColor}: ${nameColor(hex, lang)}`}
                >
                  <span className="cs-pal-letter">{letterFor(i)}</span>
                  <span className="cs-pal-name">{nameColor(hex, lang)}</span>
                  <span className="cs-pal-hex mono">{hex.toUpperCase()}</span>
                  <span className="cs-pal-gray">
                    {t.pal.gray} {fmt((grayValue(hex) / 255) * 100, 0, lang)}
                  </span>
                </button>
              );
            })}
          </div>
          <span className="hint">{t.pal.editHint}</span>
          <Switch checked={gray} onChange={setGray} label={t.pal.valueCheck} />
        </section>

        <section className="card stack">
          <h2 className="card-title">{t.pal.pairs}</h2>
          <ul className="cs-pairs">
            {pairs.map((p) => {
              const active = (pair[0] === p.a && pair[1] === p.b) || (pair[0] === p.b && pair[1] === p.a);
              return (
                <li key={`${p.a}-${p.b}`}>
                  <button type="button" className="cs-pair" aria-pressed={active} onClick={() => setPair([p.a, p.b])}>
                    <span className="cs-pair-dots" aria-hidden>
                      <span
                        style={{
                          background: gray ? toGrayHex(colors[p.a]) : colors[p.a],
                        }}
                      />
                      <span
                        style={{
                          background: gray ? toGrayHex(colors[p.b]) : colors[p.b],
                        }}
                      />
                    </span>
                    <span className="grow">
                      <span className="cs-pair-names">
                        {letterFor(p.a)} + {letterFor(p.b)}
                      </span>
                      <span className="hint">{t.pal.ratingHint[p.rating]}</span>
                    </span>
                    <span className="chip" data-tone={p.rating === 'strong' ? 'success' : p.rating === 'ok' ? 'mustard' : 'danger'}>
                      {t.pal.rating[p.rating]} · {fmt(p.ratio, 1, lang)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <span className="hint">{t.pal.previewHint}</span>
        </section>

        <section className="card stack">
          <h2 className="card-title">{t.pal.preview}</h2>
          <div className="cs-motifs">
            <KnitCanvas
              className="cs-knit"
              ariaLabel={`${t.pal.preview}: ${nameColor(pa, lang)}, ${nameColor(pb, lang)}`}
              cells={motifCells(pa, pb)}
              cols={24}
              rows={MOTIF.length}
              stW={12}
            />
            <KnitCanvas className="cs-knit" ariaLabel={`${t.pal.preview}: ${t.pal.valueCheck}`} cells={motifCells(pa, pb)} cols={24} rows={MOTIF.length} stW={12} gray />
          </div>
          <Callout tone="prof">{t.pal.valueHint}</Callout>
        </section>

        <section className="card stack">
          <h2 className="card-title">{t.pal.saveTitle}</h2>
          <div className="row-nowrap">
            <input className="input" value={name} placeholder={t.pal.defaultName(palettes.length + 1)} aria-label={t.pal.name} onChange={(e) => setName(e.target.value)} />
            <button type="button" className="btn btn-primary" onClick={save}>
              <Save />
              {c.save}
            </button>
          </div>
          <div className="label">{t.pal.saved}</div>
          {palettes.length === 0 ? (
            <p className="small faint" style={{ margin: 0 }}>
              {t.pal.noSaved}
            </p>
          ) : (
            <ul className="list">
              {palettes.map((p) => (
                <li key={p.id} className="spread">
                  <span className="row-nowrap grow">
                    <span className="cs-strip" aria-hidden>
                      {p.colors.map((h, i) => (
                        <span key={i} style={{ background: h }} />
                      ))}
                    </span>
                    <strong className="grow">{p.name}</strong>
                  </span>
                  <span className="row-nowrap">
                    <button type="button" className="btn btn-soft btn-sm" onClick={() => setDraft({ base: p.colors[0], colors: p.colors })}>
                      {t.pal.load}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon btn-sm"
                      aria-label={`${c.delete}: ${p.name}`}
                      onClick={async () => {
                        if (
                          await confirmDialog(t.pal.deleteConfirm(p.name), {
                            danger: true,
                            confirmLabel: c.delete,
                          })
                        )
                          removePalette(p.id);
                      }}
                    >
                      <Trash2 />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <ColorEditModal
        open={edit !== null}
        color={edit !== null ? colors[edit] : '#000000'}
        title={edit !== null ? t.letter(letterFor(edit)) : ''}
        onClose={() => setEdit(null)}
        onChange={(hex) => edit !== null && setColor(edit, hex)}
      />
    </ToolLayout>
  );
}
