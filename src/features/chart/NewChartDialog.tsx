import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid3x3, Image as ImageIcon, LayoutTemplate, Type } from 'lucide-react';
import type { ChartDoc, Craft } from '@/types';
import { useCharts } from '@/store/charts';
import { Modal } from '@/ui/Modal';
import { Field, NumberInput } from '@/ui/Field';
import { Segmented } from '@/ui/Segmented';
import { useTerms } from '@/ui/Term';
import { YARN_SWATCHES } from '@/knowledge/swatches';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { CHART_TEMPLATES } from '@/engine/chart/templates';
import { MAX_SIZE } from '@/engine/chart/grid';
import { ChartThumb } from './ChartThumb';
import { PhotoDialog } from './PhotoDialog';
import { PRESET_SIZES, makeBlank, makeFromTemplate, makeFromText } from './create';
import { CH } from './i18n';

type Start = 'blank' | 'template' | 'photo' | 'text';

const TEXT_COLORS = ['#f5f0e6', '#e8dcc4', '#2f2925', '#1b2a4a', '#46698a', '#5f7a61', '#b5523b', '#c0392b', '#d39a2c', '#f4a7b9', '#7d4e6d'];

export function NewChartDialog({ onClose, initial = 'blank' }: { onClose: () => void; initial?: Start }) {
  const t = useMsgs(CH);
  const c = useMsgs(COMMON);
  const lang = useLang();
  const { ctx } = useTerms();
  const nav = useNavigate();
  const [start, setStart] = useState<Start>(initial);
  const [name, setName] = useState('');
  const [craft, setCraft] = useState<Craft>('knit');
  const [mode, setMode] = useState<ChartDoc['mode']>('flat');
  const [w, setW] = useState(30);
  const [h, setH] = useState(30);
  const [tplId, setTplId] = useState(CHART_TEMPLATES[0].id);
  const [text, setText] = useState('');
  const [bg, setBg] = useState('#f5f0e6');
  const [ink, setInk] = useState('#b5523b');

  const tpl = CHART_TEMPLATES.find((x) => x.id === tplId) ?? CHART_TEMPLATES[0];
  const tplThumbs = useMemo(() => Object.fromEntries(CHART_TEMPLATES.map((x) => [x.id, makeFromTemplate(x, '', ctx)])), [ctx.lang, ctx.trabzan, ctx.crochetEn]);
  const textChart = useMemo(() => (start === 'text' ? makeFromText(text.trim() || t.textPlaceholder, { name: '', craft, mode, lang, bg, ink }) : null), [start, text, craft, mode, lang, bg, ink, t.textPlaceholder]);

  if (start === 'photo') return <PhotoDialog onClose={onClose} onBack={() => setStart('blank')} />;

  const create = () => {
    let doc: ChartDoc;
    if (start === 'template') doc = makeFromTemplate(tpl, name.trim() || tpl.name[lang], ctx);
    else if (start === 'text') {
      const body = text.trim() || t.textPlaceholder;
      doc = makeFromText(body, { name: name.trim() || body.replace(/\s+/g, ' ').slice(0, 40), craft, mode, lang, bg, ink });
    } else doc = makeBlank({ name: name.trim() || t.defaultName, craft, mode, width: w, height: h, lang });
    useCharts.getState().add(doc);
    onClose();
    nav(`/kareli/${doc.id}`);
  };

  const startOpts: { id: Start; label: string; icon: typeof Grid3x3 }[] = [
    { id: 'blank', label: t.startBlank, icon: Grid3x3 },
    { id: 'template', label: t.startTemplate, icon: LayoutTemplate },
    { id: 'photo', label: t.startPhoto, icon: ImageIcon },
    { id: 'text', label: t.startText, icon: Type },
  ];

  return (
    <Modal
      open
      onClose={onClose}
      title={t.newChart}
      wide
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            {c.cancel}
          </button>
          <button className="btn btn-primary" onClick={create}>
            {c.create}
          </button>
        </>
      }
    >
      <div className="stack">
        <div className="field">
          <span className="label">{t.startFrom}</span>
          <div className="chart-start-grid" role="radiogroup" aria-label={t.startFrom}>
            {startOpts.map((o) => (
              <button key={o.id} type="button" role="radio" aria-checked={start === o.id} className="chart-start" onClick={() => setStart(o.id)}>
                <o.icon aria-hidden />
                <span>{o.label}</span>
              </button>
            ))}
          </div>
        </div>

        {start === 'template' && (
          <div className="field">
            <span className="label">{t.chooseTemplate}</span>
            <div className="chart-template-grid" role="radiogroup" aria-label={t.chooseTemplate}>
              {CHART_TEMPLATES.map((x) => (
                <button key={x.id} type="button" role="radio" aria-checked={tplId === x.id} className="chart-template" onClick={() => setTplId(x.id)}>
                  <span className="chart-template-thumb paper-grid">
                    <ChartThumb chart={tplThumbs[x.id]} maxW={120} maxH={84} />
                  </span>
                  <span className="chart-template-name">{x.name[lang]}</span>
                  <span className="xsmall faint">
                    {x.craft === 'knit' ? c.knit : c.crochet} · {x.desc[lang]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <Field label={t.name} htmlFor="chart-new-name">
          <input
            id="chart-new-name"
            className="input"
            value={name}
            maxLength={120}
            placeholder={start === 'template' ? tpl.name[lang] : start === 'text' ? text.trim().replace(/\s+/g, ' ') || t.textPlaceholder : t.defaultName}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        {start !== 'template' && (
          <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
            <div className="field">
              <span className="label">{t.craft}</span>
              <Segmented<Craft>
                value={craft}
                onChange={setCraft}
                label={t.craft}
                options={[
                  { value: 'knit', label: c.knit },
                  { value: 'crochet', label: c.crochet },
                ]}
              />
            </div>
            <div className="field">
              <span className="label">{t.mode}</span>
              <Segmented<ChartDoc['mode']>
                value={mode}
                onChange={setMode}
                label={t.mode}
                options={[
                  { value: 'flat', label: t.flatLong },
                  { value: 'round', label: t.roundLong },
                ]}
              />
            </div>
          </div>
        )}

        {start === 'blank' && (
          <div className="field">
            <span className="label">{t.sizeLabel}</span>
            <div className="row" style={{ alignItems: 'flex-end' }}>
              <Field label={t.widthSts} htmlFor="chart-new-w" className="chart-size-field">
                <NumberInput id="chart-new-w" integer min={1} max={MAX_SIZE} value={w} onChange={setW} />
              </Field>
              <span className="chart-times" aria-hidden>
                ×
              </span>
              <Field label={t.heightRows} htmlFor="chart-new-h" className="chart-size-field">
                <NumberInput id="chart-new-h" integer min={1} max={MAX_SIZE} value={h} onChange={setH} />
              </Field>
            </div>
            <div className="row" role="group" aria-label={t.presets} style={{ gap: 6, marginTop: 4 }}>
              {PRESET_SIZES.map(([pw, ph]) => (
                <button
                  key={`${pw}x${ph}`}
                  type="button"
                  className="chip"
                  aria-pressed={pw === w && ph === h}
                  onClick={() => {
                    setW(pw);
                    setH(ph);
                  }}
                >
                  {t.size(pw, ph)}
                </button>
              ))}
            </div>
          </div>
        )}

        {start === 'text' && (
          <div className="stack">
            <Field label={t.textLabel} hint={t.textHint} htmlFor="chart-new-text">
              <textarea id="chart-new-text" className="textarea" rows={2} value={text} placeholder={t.textPlaceholder} onChange={(e) => setText(e.target.value)} style={{ minHeight: 64, textTransform: 'uppercase' }} />
            </Field>
            <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
              <SwatchRow label={t.textBg} value={bg} onChange={setBg} />
              <SwatchRow label={t.textInk} value={ink} onChange={setInk} />
            </div>
            {textChart && (
              <div className="chart-text-preview paper-grid">
                <ChartThumb chart={textChart} maxW={520} maxH={140} />
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

function SwatchRow({ label, value, onChange }: { label: string; value: string; onChange: (hex: string) => void }) {
  const lang = useLang();
  return (
    <div className="field">
      <span className="label">{label}</span>
      <div className="row" role="group" aria-label={label} style={{ gap: 6 }}>
        {TEXT_COLORS.map((hex) => {
          const n = YARN_SWATCHES.find((s) => s.hex === hex)?.name[lang] ?? hex;
          return <button key={hex} type="button" className="swatch" style={{ background: hex }} aria-pressed={hex === value} aria-label={n} title={n} onClick={() => onChange(hex)} />;
        })}
      </div>
    </div>
  );
}
