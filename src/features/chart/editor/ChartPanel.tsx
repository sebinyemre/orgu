import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Eraser, FileDown, Maximize, Printer, Trash2 } from 'lucide-react';
import type { ChartDoc } from '@/types';
import { useCharts } from '@/store/charts';
import { useSettings } from '@/store/settings';
import { confirmDialog } from '@/ui/Confirm';
import { Field, NumberInput, Stepper, Switch } from '@/ui/Field';
import { Modal } from '@/ui/Modal';
import { Segmented } from '@/ui/Segmented';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { fmtLength } from '@/lib/format';
import { downloadJSON, slugify } from '@/lib/download';
import { cmFor, heightFor } from '@/engine/math/gauge';
import { exportCharts } from '@/engine/chart/io';
import { MAX_SIZE, blankGrid, resizeGrid, shiftRect, type ResizeEdges } from '@/engine/chart/grid';
import type { PaperStyle } from '@/engine/chart/render';
import { useChartPrefs } from '../prefs';
import { CH } from '../i18n';
import { StyleSwitch } from './SymbolsPanel';
import { applyDoc, docPatch, snapshot, useEditor } from './state';

export function ChartPanel({ chart, onPng, onPrint }: { chart: ChartDoc; onPng: () => void; onPrint: () => void }) {
  const t = useMsgs(CH);
  const c = useMsgs(COMMON);
  const nav = useNavigate();
  const units = useSettings((s) => s.units);
  const prefs = useChartPrefs();
  const doc = useEditor((s) => s.doc);
  const [resizing, setResizing] = useState(false);
  const update = (p: Partial<ChartDoc>) => useCharts.getState().update(chart.id, p);
  const gauge = chart.gauge ?? (chart.craft === 'knit' ? { stitches: 22, rows: 30 } : { stitches: 18, rows: 20 });

  const clear = async () => {
    if (!(await confirmDialog(t.clearConfirm, { confirmLabel: t.clearChart, danger: true }))) return;
    const g = blankGrid(doc.width, doc.height, -1);
    applyDoc({ ...snapshot(doc), colors: g.colors, symbols: g.symbols, repeat: undefined });
  };
  const remove = async () => {
    if (!(await confirmDialog(t.deleteConfirm(chart.name), { title: t.deleteTitle, confirmLabel: c.delete, danger: true }))) return;
    nav('/kareli');
    useCharts.getState().remove(chart.id);
  };
  const json = () => downloadJSON(exportCharts([{ ...chart, ...docPatch(doc) } as ChartDoc]), `${slugify(chart.name)}.json`);

  return (
    <div className="stack chart-settings">
      <Field label={t.notes} htmlFor="chart-notes">
        <textarea id="chart-notes" className="textarea" value={chart.notes ?? ''} placeholder={t.notesPlaceholder} onChange={(e) => update({ notes: e.target.value })} rows={3} />
      </Field>

      <div className="field">
        <span className="label">{t.mode}</span>
        <Segmented<ChartDoc['mode']>
          value={chart.mode}
          onChange={(v) => update({ mode: v })}
          label={t.mode}
          options={[
            { value: 'flat', label: t.flatLong },
            { value: 'round', label: t.roundLong },
          ]}
        />
      </div>
      {chart.mode === 'flat' && (
        <div className="field">
          <span className="label">{t.firstRow}</span>
          <Segmented<'rs' | 'ws'>
            value={chart.firstRowRS ? 'rs' : 'ws'}
            onChange={(v) => update({ firstRowRS: v === 'rs' })}
            label={t.firstRow}
            options={[
              { value: 'rs', label: t.rsSide },
              { value: 'ws', label: t.wsSide },
            ]}
          />
        </div>
      )}

      <div className="field">
        <span className="label">{t.paper}</span>
        <Segmented<PaperStyle>
          value={prefs.paper}
          onChange={(v) => prefs.set({ paper: v })}
          label={t.paper}
          options={[
            { value: 'clean', label: t.paperClean },
            { value: 'pencil', label: t.paperPencil },
          ]}
        />
      </div>
      <StyleSwitch />
      <Switch checked={prefs.numbers} onChange={(v) => prefs.set({ numbers: v })} label={t.showNumbers} />

      <Switch checked={chart.proportional} onChange={(v) => update({ proportional: v, gauge })} label={t.proportional} hint={t.proportionalHint} />
      <div className="field">
        <span className="label">{t.gauge}</span>
        <div className="row">
          <NumberInput value={gauge.stitches} min={1} max={80} onChange={(n) => update({ gauge: { ...gauge, stitches: n } })} suffix={t.gaugeSts} ariaLabel={t.gaugeSts} className="chart-gauge-input" />
          <NumberInput value={gauge.rows} min={1} max={120} onChange={(n) => update({ gauge: { ...gauge, rows: n } })} suffix={t.gaugeRows} ariaLabel={t.gaugeRows} className="chart-gauge-input" />
        </div>
        <span className="hint">{t.finished(fmtLength(cmFor(doc.width, gauge.stitches), units), fmtLength(heightFor(doc.height, gauge.rows), units))}</span>
      </div>

      <div className="field">
        <span className="label">{t.sizeLabel}</span>
        <div className="row">
          <span className="chip" data-tone="denim">
            {t.size(doc.width, doc.height)}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => setResizing(true)}>
            <Maximize /> {t.resize}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={clear}>
            <Eraser /> {t.clearChart}
          </button>
        </div>
      </div>

      <div className="field">
        <span className="label">{t.exportTitle}</span>
        <div className="row">
          <button className="btn btn-soft btn-sm" onClick={onPng}>
            <Download /> {t.exportPng}
          </button>
          <button className="btn btn-soft btn-sm" onClick={onPrint}>
            <Printer /> {c.print}
          </button>
          <button className="btn btn-soft btn-sm" onClick={json}>
            <FileDown /> {t.exportJson}
          </button>
        </div>
      </div>

      <hr style={{ margin: 'var(--space-2) 0' }} />
      <button className="btn btn-danger btn-sm" onClick={remove} style={{ alignSelf: 'flex-start' }}>
        <Trash2 /> {t.deleteChart}
      </button>

      {resizing && <ResizeDialog onClose={() => setResizing(false)} />}
    </div>
  );
}

function ResizeDialog({ onClose }: { onClose: () => void }) {
  const t = useMsgs(CH);
  const c = useMsgs(COMMON);
  const doc = useEditor((s) => s.doc);
  const [e, setE] = useState<ResizeEdges>({ top: 0, bottom: 0, left: 0, right: 0 });
  const w = Math.max(1, Math.min(MAX_SIZE, doc.width + e.left + e.right));
  const h = Math.max(1, Math.min(MAX_SIZE, doc.height + e.top + e.bottom));
  const apply = () => {
    const g = resizeGrid(doc, e, -1);
    applyDoc({ ...snapshot(doc), ...g, repeat: shiftRect(doc.repeat, e, g.width, g.height) });
    onClose();
  };
  const edge = (k: keyof ResizeEdges, label: string, horiz: boolean) => (
    <Field label={label}>
      <Stepper value={e[k]} onChange={(n) => setE({ ...e, [k]: n })} min={-((horiz ? doc.width : doc.height) - 1)} max={MAX_SIZE} ariaLabel={label} />
    </Field>
  );
  return (
    <Modal
      open
      onClose={onClose}
      title={t.resize}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            {c.cancel}
          </button>
          <button className="btn btn-primary" onClick={apply}>
            {t.apply}
          </button>
        </>
      }
    >
      <p className="small muted">{t.resizeHint}</p>
      <div className="chart-resize-grid">
        <div style={{ gridArea: 't' }}>{edge('top', t.edgeTop, false)}</div>
        <div style={{ gridArea: 'l' }}>{edge('left', t.edgeLeft, true)}</div>
        <div style={{ gridArea: 'c' }} className="chart-resize-center">
          {t.size(w, h)}
        </div>
        <div style={{ gridArea: 'r' }}>{edge('right', t.edgeRight, true)}</div>
        <div style={{ gridArea: 'b' }}>{edge('bottom', t.edgeBottom, false)}</div>
      </div>
      <p className="small" style={{ marginTop: 'var(--space-3)' }}>
        <b>{t.newSize(w, h)}</b>
      </p>
    </Modal>
  );
}
