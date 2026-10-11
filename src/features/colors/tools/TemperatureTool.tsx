import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, CloudDownload, MapPin, Plus, RotateCcw, Search, ThermometerSun, Trash2, X } from 'lucide-react';
import type { Craft, YarnWeightId } from '@/types';
import { LOCALE, useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { Segmented } from '@/ui/Segmented';
import { NumberInput, Stepper } from '@/ui/Field';
import { Modal } from '@/ui/Modal';
import { Callout } from '@/ui/Callout';
import { confirmDialog } from '@/ui/Confirm';
import { toast } from '@/store/toast';
import { YARN_WEIGHTS, typicalGauge } from '@/knowledge/yarnWeights';
import { inkOn } from '@/lib/color';
import { fmt, fmtDate, fmtMeters } from '@/lib/format';
import { LengthInput, useLen, weightLabel } from '@/features/calculators/ui';
import { CLR } from '../i18n';
import {
  DEFAULT_LIMITS,
  DEFAULT_TEMP_COLORS,
  archiveLastDay,
  archiveUrl,
  blanketRows,
  cToF,
  daysOf,
  fToC,
  geocodeUrl,
  metersPerRow,
  parseArchive,
  parseGeocode,
  parseTempList,
  rangeIndex,
  weekdayMon,
  type DayTemp,
  type GeoPlace,
} from '../logic';
import { useColorStudio, type TempPlan } from '../store';
import { drawStripesFlat, rowsToCells } from '../fabric';
import { ColorEditModal, KnitCanvas, ToolLayout } from '../ui';

const EMPTY = '#cfc6ba';

function keyTs(k: string): number {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d, 12).getTime();
}

/** Sıcaklık görünümü (seçili birimde) */
function useTemp(unit: 'C' | 'F') {
  const lang = useLang();
  return {
    show: (c: number, digits: 0 | 1 = 1) => `${fmt(unit === 'F' ? cToF(c) : c, digits, lang)}°${unit}`,
    toUnit: (c: number) => Math.round((unit === 'F' ? cToF(c) : c) * 10) / 10,
    fromUnit: (v: number) => (unit === 'F' ? fToC(v) : v),
  };
}

function RangesEditor({ plan, set }: { plan: TempPlan; set: (p: Partial<TempPlan>) => void }) {
  const t = useMsgs(CLR);
  const c = useMsgs(COMMON);
  const temp = useTemp(plan.unit);
  const [edit, setEdit] = useState<number | null>(null);
  const { limits, colors } = plan;
  const n = colors.length;
  const label = (i: number) =>
    i === 0
      ? t.tmp.rangeBelow(temp.show(limits[0], 0))
      : i === n - 1
        ? t.tmp.rangeAbove(temp.show(limits[n - 2], 0))
        : t.tmp.rangeBetween(temp.show(limits[i - 1], 0), temp.show(limits[i], 0));
  const setLimit = (i: number, v: number) => set({ limits: limits.map((l, j) => (j === i ? temp.fromUnit(v) : l)) });
  const remove = (i: number) => {
    const li = Math.min(i, limits.length - 1);
    set({
      colors: colors.filter((_, j) => j !== i),
      limits: limits.filter((_, j) => j !== li),
    });
  };
  const add = () =>
    set({
      limits: [...limits, (limits[limits.length - 1] ?? 0) + 5],
      colors: [...colors, '#7d4e6d'],
    });
  return (
    <div className="stack-sm">
      <ul className="cs-ranges">
        {colors.map((hex, i) => (
          <li key={i}>
            <button type="button" className="swatch swatch-lg" style={{ background: hex }} onClick={() => setEdit(i)} aria-label={`${t.editColor}: ${label(i)}`} />
            <span className="grow small">{label(i)}</span>
            {i < n - 1 && (
              <span className="cs-limit">
                <NumberInput
                  value={temp.toUnit(limits[i])}
                  min={i > 0 ? temp.toUnit(limits[i - 1]) + 0.1 : undefined}
                  max={i < n - 2 ? temp.toUnit(limits[i + 1]) - 0.1 : undefined}
                  onChange={(v) => setLimit(i, v)}
                  suffix={`°${plan.unit}`}
                  ariaLabel={t.tmp.limitLabel(i + 1)}
                />
              </span>
            )}
            {n > 2 && (
              <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => remove(i)} aria-label={`${c.delete}: ${label(i)}`}>
                <X />
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="row">
        {n < 14 && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={add}>
            <Plus />
            {c.add}
          </button>
        )}
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => set({ limits: DEFAULT_LIMITS, colors: DEFAULT_TEMP_COLORS })}>
          <RotateCcw />
          {t.tmp.resetRanges}
        </button>
      </div>
      <ColorEditModal
        open={edit !== null}
        color={edit !== null ? colors[edit] : '#000000'}
        title={edit !== null ? label(edit) : ''}
        onClose={() => setEdit(null)}
        onChange={(hex) => edit !== null && set({ colors: colors.map((x, j) => (j === edit ? hex : x)) })}
      />
    </div>
  );
}

type FetchStatus = {
  kind: 'idle' | 'loading' | 'error' | 'ok' | 'info';
  text?: string;
  note?: string;
};

function FetchPanel({ plan, days }: { plan: TempPlan; days: string[] }) {
  const t = useMsgs(CLR);
  const lang = useLang();
  const setTemp = useColorStudio((s) => s.setTemp);
  const setDays = useColorStudio((s) => s.setDays);
  const [query, setQuery] = useState(plan.place?.name ?? '');
  const [places, setPlaces] = useState<GeoPlace[]>([]);
  const [status, setStatus] = useState<FetchStatus>({ kind: 'idle' });
  const placeLabel = (p: GeoPlace) => [p.name, p.admin1, p.country].filter(Boolean).join(', ');

  const find = async () => {
    if (!query.trim()) return;
    setStatus({ kind: 'loading' });
    try {
      const res = await fetch(geocodeUrl(query, lang));
      if (!res.ok) throw new Error(String(res.status));
      const list = parseGeocode(await res.json());
      setPlaces(list);
      setStatus(list.length ? { kind: 'idle' } : { kind: 'info', text: t.tmp.noResults });
    } catch {
      setStatus({ kind: 'error', text: t.tmp.fetchError });
    }
  };

  const load = async (place: NonNullable<TempPlan['place']>) => {
    const start = days[0];
    const last = archiveLastDay(new Date());
    const end = days[days.length - 1] < last ? days[days.length - 1] : last;
    if (start > end) {
      setStatus({ kind: 'info', text: t.tmp.futureOnly });
      return;
    }
    setStatus({ kind: 'loading' });
    try {
      const res = await fetch(archiveUrl(place.lat, place.lon, start, end));
      if (!res.ok) throw new Error(String(res.status));
      const data = parseArchive(await res.json());
      const n = Object.keys(data).length;
      setDays(data);
      setStatus({
        kind: 'ok',
        text: t.tmp.fetched(n, place.label),
        note: end < days[days.length - 1] ? t.tmp.tooRecent : undefined,
      });
    } catch {
      setStatus({ kind: 'error', text: t.tmp.fetchError });
    }
  };

  const pick = (p: GeoPlace) => {
    const place = {
      name: p.name,
      label: placeLabel(p),
      lat: p.latitude,
      lon: p.longitude,
    };
    setTemp({ place });
    setPlaces([]);
    setQuery(p.name);
    void load(place);
  };

  return (
    <div className="stack-sm">
      <form
        className="row-nowrap"
        onSubmit={(e) => {
          e.preventDefault();
          void find();
        }}
      >
        <input className="input" value={query} placeholder={t.tmp.cityPh} aria-label={t.tmp.city} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit" className="btn btn-soft" disabled={status.kind === 'loading' || !query.trim()}>
          <Search />
          {t.tmp.find}
        </button>
      </form>
      {places.length > 0 && (
        <div className="stack-sm">
          <span className="label">{t.tmp.pickPlace}</span>
          <div className="cs-places">
            {places.map((p) => (
              <button key={`${p.id}-${p.latitude}`} type="button" className="btn btn-ghost btn-sm cs-place" onClick={() => pick(p)}>
                <MapPin />
                {placeLabel(p)}
              </button>
            ))}
          </div>
        </div>
      )}
      {plan.place && (
        <div className="row">
          <span className="chip" data-tone="denim">
            <MapPin /> {plan.place.label}
          </span>
          <button type="button" className="btn btn-primary btn-sm" disabled={status.kind === 'loading'} onClick={() => plan.place && void load(plan.place)}>
            <CloudDownload />
            {status.kind === 'loading' ? t.tmp.fetching : t.tmp.fetch}
          </button>
        </div>
      )}
      {status.kind === 'loading' && (
        <p className="small muted" style={{ margin: 0 }}>
          {t.tmp.fetching}
        </p>
      )}
      {status.kind === 'error' && <Callout tone="warn">{status.text}</Callout>}
      {status.kind === 'info' && <Callout tone="info">{status.text}</Callout>}
      {status.kind === 'ok' && (
        <Callout tone="tip">
          {status.text}
          {status.note && <div className="small muted">{status.note}</div>}
        </Callout>
      )}
      <span className="hint">{t.tmp.attribution}</span>
    </div>
  );
}

function PastePanel({ plan, days }: { plan: TempPlan; days: string[] }) {
  const t = useMsgs(CLR);
  const lang = useLang();
  const setDays = useColorStudio((s) => s.setDays);
  const firstEmpty = days.find((d) => typeof plan.days[d]?.[plan.source] !== 'number') ?? days[0];
  const [start, setStart] = useState(firstEmpty);
  const [text, setText] = useState('');
  useEffect(() => setStart((s) => (days.includes(s) ? s : firstEmpty)), [days, firstEmpty]);
  const apply = () => {
    const vals = parseTempList(text);
    const from = Math.max(0, days.indexOf(start));
    const patch: Record<string, DayTemp> = {};
    vals.forEach((v, i) => {
      const k = days[from + i];
      if (!k) return;
      const c = plan.unit === 'F' ? fToC(v) : v;
      patch[k] = { ...plan.days[k], [plan.source]: c };
    });
    const n = Object.keys(patch).length;
    if (n) {
      setDays(patch);
      setText('');
      toast(t.tmp.pasteDone(n));
    }
  };
  return (
    <div className="stack-sm">
      <p className="small muted" style={{ margin: 0 }}>
        {t.tmp.manualHint}
      </p>
      <label className="label" htmlFor="cs-paste">
        {t.tmp.paste}
      </label>
      <textarea id="cs-paste" className="textarea mono" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="12 13,5 9 -2 …" />
      <div className="row">
        <input
          type="date"
          className="input cs-date"
          value={start}
          min={days[0]}
          max={days[days.length - 1]}
          onChange={(e) => e.target.value && setStart(e.target.value)}
          aria-label={t.tmp.pasteHint(fmtDate(keyTs(start), false, lang))}
        />
        <button type="button" className="btn btn-soft" onClick={apply} disabled={!text.trim()}>
          {t.tmp.pasteApply}
        </button>
      </div>
      <span className="hint">{t.tmp.pasteHint(fmtDate(keyTs(start), false, lang))}</span>
    </div>
  );
}

function DayModal({ dayKey, plan, days, onClose, onMove }: { dayKey: string | null; plan: TempPlan; days: string[]; onClose: () => void; onMove: (k: string) => void }) {
  const t = useMsgs(CLR);
  const lang = useLang();
  const setDays = useColorStudio((s) => s.setDays);
  const temp = useTemp(plan.unit);
  if (!dayKey) return null;
  const i = days.indexOf(dayKey);
  const cur = plan.days[dayKey]?.[plan.source];
  const write = (c: number | undefined) => {
    const next: DayTemp = { ...plan.days[dayKey] };
    if (c === undefined) delete next[plan.source];
    else next[plan.source] = c;
    setDays({ [dayKey]: next });
  };
  const idx = typeof cur === 'number' ? rangeIndex(cur, plan.limits) : -1;
  return (
    <Modal open onClose={onClose} title={fmtDate(keyTs(dayKey), false, lang)}>
      <div className="stack">
        <div
          className="cs-day-preview"
          style={{
            background: idx >= 0 ? plan.colors[idx] : 'var(--paper-2)',
            color: idx >= 0 ? inkOn(plan.colors[idx]) : 'var(--ink-2)',
          }}
        >
          {typeof cur === 'number' ? temp.show(cur) : t.tmp.noValue}
        </div>
        <div className="field">
          <label className="label" htmlFor="cs-day">
            {t.tmp.dayValue} ({plan.source === 'max' ? t.tmp.max : t.tmp.mean})
          </label>
          <NumberInput id="cs-day" value={typeof cur === 'number' ? temp.toUnit(cur) : undefined} onChange={(v) => write(temp.fromUnit(v))} suffix={`°${plan.unit}`} />
        </div>
        <div className="spread">
          <button type="button" className="btn btn-ghost" disabled={i <= 0} onClick={() => onMove(days[i - 1])}>
            <ChevronLeft />
            {t.tmp.prevDay}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => write(undefined)} disabled={typeof cur !== 'number'}>
            <Trash2 />
            {t.tmp.clearDay}
          </button>
          <button type="button" className="btn btn-soft" disabled={i >= days.length - 1} onClick={() => onMove(days[i + 1])}>
            {t.tmp.nextDay}
            <ChevronRight />
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Calendar({ plan, days, rows, onPick }: { plan: TempPlan; days: string[]; rows: number[]; onPick: (k: string) => void }) {
  const lang = useLang();
  const temp = useTemp(plan.unit);
  const t = useMsgs(CLR);
  const months = useMemo(() => {
    const m = new Map<string, { key: string; idx: number }[]>();
    days.forEach((k, idx) => {
      const mk = k.slice(0, 7);
      m.set(mk, [...(m.get(mk) ?? []), { key: k, idx }]);
    });
    return [...m.entries()];
  }, [days]);
  const monthFmt = new Intl.DateTimeFormat(LOCALE[lang], { month: 'long' });
  const wdFmt = new Intl.DateTimeFormat(LOCALE[lang], { weekday: 'narrow' });
  // 2024-01-01 bir pazartesidir
  const weekdays = Array.from({ length: 7 }, (_, i) => wdFmt.format(new Date(2024, 0, 1 + i)));
  const big = months.length === 1;
  return (
    <div className={`cs-cal${big ? ' big' : ''}`}>
      {months.map(([mk, list]) => (
        <div key={mk} className="cs-month">
          <div className="cs-month-name">{monthFmt.format(new Date(Number(mk.slice(0, 4)), Number(mk.slice(5, 7)) - 1, 1))}</div>
          <div className="cs-month-grid">
            {weekdays.map((w, i) => (
              <span key={`w${i}`} className="cs-wd" aria-hidden>
                {w}
              </span>
            ))}
            {Array.from({ length: weekdayMon(list[0].key) }, (_, i) => (
              <span key={`b${i}`} />
            ))}
            {list.map(({ key, idx }) => {
              const ci = rows[idx];
              const v = plan.days[key]?.[plan.source];
              const bg = ci >= 0 ? plan.colors[ci] : undefined;
              return (
                <button
                  key={key}
                  type="button"
                  className={`cs-day${ci < 0 ? ' empty' : ''}`}
                  style={bg ? { background: bg, color: inkOn(bg) } : undefined}
                  onClick={() => onPick(key)}
                  aria-label={`${fmtDate(keyTs(key), false, lang)}: ${typeof v === 'number' ? temp.show(v) : t.tmp.noValue}`}
                >
                  {Number(key.slice(8))}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function BlanketPreview({ rowColors, label }: { rowColors: (string | null)[]; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const many = rowColors.length > 70;
  const rowH = Math.max(1, Math.min(8, 640 / Math.max(1, rowColors.length)));
  useEffect(() => {
    if (many && ref.current) drawStripesFlat(ref.current, rowColors, 300, rowH, EMPTY);
  }, [rowColors, many, rowH]);
  if (!many) {
    const filled = rowColors.map((c) => c ?? EMPTY);
    return <KnitCanvas className="cs-knit" ariaLabel={label} cells={rowsToCells(filled, 24)} cols={24} rows={filled.length} stW={12} />;
  }
  return (
    <canvas
      ref={ref}
      className="cs-knit cs-flat"
      role="img"
      aria-label={label}
      style={{
        width: 300,
        aspectRatio: `300 / ${Math.max(1, rowColors.length * rowH)}`,
      }}
    />
  );
}

export default function TemperatureTool() {
  const t = useMsgs(CLR);
  const c = useMsgs(COMMON);
  const lang = useLang();
  const len = useLen();
  const plan = useColorStudio((s) => s.temp);
  const set = useColorStudio((s) => s.setTemp);
  const setDays = useColorStudio((s) => s.setDays);
  const [day, setDay] = useState<string | null>(null);
  const [view, setView] = useState<'calendar' | 'blanket'>('calendar');
  const temp = useTemp(plan.unit);

  const days = useMemo(() => daysOf(plan.year, plan.period === 'month' ? plan.month : undefined), [plan.year, plan.period, plan.month]);
  const rows = useMemo(() => blanketRows(days, plan.days, plan.source, plan.limits), [days, plan.days, plan.source, plan.limits]);
  const missing = rows.filter((r) => r < 0).length;
  const counts = plan.colors.map((_, i) => rows.filter((r) => r === i).length);
  const rowColors = useMemo(() => rows.flatMap((r) => Array.from({ length: plan.rowsPerDay }, () => (r >= 0 ? plan.colors[r] : null))), [rows, plan.rowsPerDay, plan.colors]);
  const gauge = plan.craft === 'knit' ? typicalGauge(plan.weight, 'knit') : typicalGauge(plan.weight, 'crochet', 'hdc');
  const mPerRow = metersPerRow(plan.widthCm, gauge, plan.craft === 'knit' ? 'knit' : 'hdc');
  const totalRows = days.length * plan.rowsPerDay;
  const heightCm = (totalRows * 10) / gauge.rows;
  const monthFmt = new Intl.DateTimeFormat(LOCALE[lang], { month: 'long' });
  const rangeLabel = (i: number) => {
    const n = plan.colors.length;
    return i === 0
      ? t.tmp.rangeBelow(temp.show(plan.limits[0], 0))
      : i === n - 1
        ? t.tmp.rangeAbove(temp.show(plan.limits[n - 2], 0))
        : t.tmp.rangeBetween(temp.show(plan.limits[i - 1], 0), temp.show(plan.limits[i], 0));
  };
  const clear = async () => {
    if (
      !(await confirmDialog(t.tmp.clearConfirm, {
        danger: true,
        confirmLabel: c.delete,
      }))
    )
      return;
    const rest = Object.fromEntries(Object.entries(plan.days).filter(([k]) => !days.includes(k)));
    setDays(rest, true);
  };

  return (
    <ToolLayout id="sicaklik" icon={<ThermometerSun />}>
      <p className="muted cs-intro">{t.tmp.intro}</p>
      <div className="cs-cols">
        <div className="cs-col">
          <section className="card stack">
            <div className="field">
              <span className="label">{t.tmp.period}</span>
              <Segmented
                label={t.tmp.period}
                value={plan.period}
                onChange={(period) => set({ period })}
                options={[
                  { value: 'year', label: t.tmp.wholeYear },
                  { value: 'month', label: t.tmp.oneMonth },
                ]}
              />
            </div>
            <div className="cs-two">
              <div className="field">
                <label className="label" htmlFor="cs-year">
                  {t.tmp.year}
                </label>
                <NumberInput id="cs-year" integer min={1940} max={2100} value={plan.year} onChange={(year) => set({ year })} />
              </div>
              {plan.period === 'month' && (
                <div className="field">
                  <label className="label" htmlFor="cs-month">
                    {t.tmp.month}
                  </label>
                  <select id="cs-month" className="select" value={plan.month} onChange={(e) => set({ month: Number(e.target.value) })}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i + 1}>
                        {monthFmt.format(new Date(2024, i, 1))}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="cs-two">
              <div className="field">
                <span className="label">{t.tmp.source}</span>
                <Segmented
                  label={t.tmp.source}
                  value={plan.source}
                  onChange={(source) => set({ source })}
                  options={[
                    { value: 'max', label: t.tmp.max },
                    { value: 'mean', label: t.tmp.mean },
                  ]}
                />
              </div>
              <div className="field">
                <span className="label">{t.tmp.unit}</span>
                <Segmented
                  label={t.tmp.unit}
                  value={plan.unit}
                  onChange={(unit) => set({ unit })}
                  options={[
                    { value: 'C', label: '°C' },
                    { value: 'F', label: '°F' },
                  ]}
                />
              </div>
            </div>
          </section>

          <section className="card stack">
            <h2 className="card-title">{t.tmp.fetchTitle}</h2>
            <FetchPanel plan={plan} days={days} />
            <div className="cs-sep" />
            <h3 className="card-title">{t.tmp.manualTitle}</h3>
            <PastePanel plan={plan} days={days} />
            <div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>
                <Trash2 />
                {t.tmp.clear}
              </button>
            </div>
          </section>
        </div>
        <div className="cs-col">
          <section className="card stack">
            <h2 className="card-title">{t.tmp.ranges}</h2>
            <RangesEditor plan={plan} set={set} />
          </section>
        </div>
      </div>
      <div className="cs-stack">
        <section className="card stack cs-span">
          <div className="spread">
            <Segmented
              label={t.tmp.calendar}
              value={view}
              onChange={setView}
              options={[
                { value: 'calendar', label: t.tmp.calendar },
                { value: 'blanket', label: t.tmp.blanket },
              ]}
            />
            <span className={`small ${missing ? 'muted' : ''}`}>{missing ? t.tmp.missing(missing) : t.tmp.complete}</span>
          </div>
          {view === 'calendar' ? (
            <Calendar plan={plan} days={days} rows={rows} onPick={setDay} />
          ) : (
            <div className="cs-preview-scroll center">
              <BlanketPreview rowColors={rowColors} label={t.tmp.blanket} />
            </div>
          )}
          <div className="cs-legend">
            {plan.colors.map((hex, i) => (
              <span key={i} className="row-nowrap small">
                <span className="swatch" style={{ background: hex }} aria-hidden />
                {rangeLabel(i)}
              </span>
            ))}
          </div>
        </section>

        <section className="card stack cs-span">
          <h2 className="card-title">{t.tmp.summary}</h2>
          <div className="cs-sum-inputs">
            <div className="field">
              <span className="label">
                {c.knit} / {c.crochet}
              </span>
              <Segmented<Craft>
                label={`${c.knit} / ${c.crochet}`}
                value={plan.craft}
                onChange={(craft) => set({ craft })}
                options={[
                  { value: 'knit', label: c.knit },
                  { value: 'crochet', label: c.crochet },
                ]}
              />
            </div>
            <div className="field">
              <span className="label">{t.tmp.rowsPerDay}</span>
              <Stepper value={plan.rowsPerDay} min={1} max={6} onChange={(rowsPerDay) => set({ rowsPerDay })} ariaLabel={t.tmp.rowsPerDay} />
            </div>
            <div className="field">
              <label className="label" htmlFor="cs-width">
                {t.tmp.width}
              </label>
              <LengthInput id="cs-width" cm={plan.widthCm} onChange={(widthCm) => set({ widthCm })} />
            </div>
            <div className="field">
              <label className="label" htmlFor="cs-weight">
                {t.yarnWeight}
              </label>
              <select id="cs-weight" className="select" value={plan.weight} onChange={(e) => set({ weight: Number(e.target.value) as YarnWeightId })}>
                {YARN_WEIGHTS.map((w) => (
                  <option key={w.id} value={w.id}>
                    {weightLabel(w, lang)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="cs-skein">
                {t.skeinLength}
              </label>
              <NumberInput id="cs-skein" min={1} value={plan.skeinM} onChange={(skeinM) => set({ skeinM })} suffix="m" />
            </div>
          </div>
          <p className="small muted" style={{ margin: 0 }}>
            {t.tmp.totalRows(totalRows)} · {t.tmp.size(len(plan.widthCm, 0), len(heightCm, 0))}
          </p>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>{t.tmp.colRange}</th>
                  <th>{t.tmp.colDays}</th>
                  <th>{t.tmp.colRows}</th>
                  <th>{t.tmp.colYarn}</th>
                </tr>
              </thead>
              <tbody>
                {plan.colors.map((hex, i) => {
                  const r = counts[i] * plan.rowsPerDay;
                  const m = r * mPerRow;
                  return (
                    <tr key={i}>
                      <td>
                        <span className="row-nowrap">
                          <span className="swatch" style={{ background: hex }} aria-hidden />
                          {rangeLabel(i)}
                        </span>
                      </td>
                      <td className="tabular">{counts[i]}</td>
                      <td className="tabular">{r}</td>
                      <td className="tabular">
                        {fmtMeters(m, lang)}
                        {m > 0 && <span className="faint small"> · {t.skeins(fmt(Math.ceil((m / plan.skeinM) * 10) / 10, 1, lang))}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Callout tone="prof">{t.tmp.tip}</Callout>
        </section>
      </div>
      <DayModal dayKey={day} plan={plan} days={days} onClose={() => setDay(null)} onMove={setDay} />
    </ToolLayout>
  );
}
