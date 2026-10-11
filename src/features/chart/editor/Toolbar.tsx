import type { LucideIcon } from 'lucide-react';
import {
  ClipboardPaste,
  Copy,
  Eraser,
  FlipHorizontal2,
  FlipVertical2,
  Hand,
  LayoutGrid,
  PaintBucket,
  Pencil,
  Pipette,
  Repeat,
  RotateCw,
  Scissors,
  Slash,
  Square,
  SquareDashed,
  Trash2,
  Type,
  X,
  Check,
} from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import type { PaintMode, Symmetry } from '@/engine/chart/grid';
import { SYMBOL_BY_ID } from '@/knowledge/symbols';
import { Segmented } from '@/ui/Segmented';
import { SymbolGlyph } from '@/ui/SymbolGlyph';
import { useMsgs } from '@/i18n';
import { inkOn } from '@/lib/color';
import { useChartPrefs } from '../prefs';
import { CH, type ChartMsgs } from '../i18n';
import { applyDoc, setTool, snapshot, useEditor, type ToolId } from './state';
import { clearSel, copySel, cutSel, deselect, flipSelH, flipSelV, pasteClip, rotateSel } from './actions';

type Key = keyof ChartMsgs;

export const TOOLS: { id: ToolId; icon: LucideIcon; label: Key; key: string }[] = [
  { id: 'pencil', icon: Pencil, label: 'toolPencil', key: 'P' },
  { id: 'eraser', icon: Eraser, label: 'toolEraser', key: 'E' },
  { id: 'fill', icon: PaintBucket, label: 'toolFill', key: 'F' },
  { id: 'line', icon: Slash, label: 'toolLine', key: 'L' },
  { id: 'rect', icon: Square, label: 'toolRect', key: 'R' },
  { id: 'picker', icon: Pipette, label: 'toolPicker', key: 'I' },
  { id: 'select', icon: SquareDashed, label: 'toolSelect', key: 'S' },
  { id: 'text', icon: Type, label: 'toolText', key: 'T' },
  { id: 'repeat', icon: Repeat, label: 'toolRepeat', key: 'B' },
  { id: 'hand', icon: Hand, label: 'toolHand', key: 'H' },
];

export function ToolButtons() {
  const t = useMsgs(CH);
  const tool = useEditor((s) => s.tool);
  return (
    <div className="chart-toolset" role="toolbar" aria-label={t.tools}>
      {TOOLS.map((x) => {
        const label = t[x.label] as string;
        return (
          <button key={x.id} type="button" className="chart-tool" aria-pressed={tool === x.id} aria-label={`${label} (${x.key})`} title={`${label} (${x.key})`} onClick={() => setTool(x.id)}>
            <x.icon aria-hidden />
            <span className="chart-tool-label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Seçili renk + sembol "mürekkep hokkası" */
export function InkWell({ onClick }: { onClick: () => void }) {
  const t = useMsgs(CH);
  const color = useEditor((s) => s.color);
  const symbol = useEditor((s) => s.symbol);
  const paint = useEditor((s) => s.paint);
  const palette = useEditor((s) => s.doc.palette);
  const style = useChartPrefs((s) => s.symbolStyle);
  const hex = palette[color]?.hex;
  const showSym = paint !== 'color' && SYMBOL_BY_ID[symbol];
  const bg = paint === 'symbol' ? 'var(--grid-bg)' : (hex ?? 'var(--grid-bg)');
  const ink = paint !== 'symbol' && hex ? inkOn(hex) : 'var(--ink)';
  return (
    <button type="button" className="chart-ink" onClick={onClick} aria-label={t.currentInk} title={t.currentInk}>
      <span className="chart-ink-swatch" style={{ background: bg, color: ink }}>
        {showSym ? <SymbolGlyph symbol={symbol} size={26} ink={ink} bg={bg} style={style} weight={9} /> : <span className="chart-ink-letter">{palette[color]?.letter ?? ''}</span>}
      </span>
    </button>
  );
}

/** Seçili aracın seçenekleri (üstteki ince şerit) */
export function ToolOptions({ onTilePreview }: { onTilePreview?: () => void }) {
  const t = useMsgs(CH);
  const s = useEditor(
    useShallow((x) => ({ tool: x.tool, paint: x.paint, symmetry: x.symmetry, rectFilled: x.rectFilled, stampText: x.stampText, selection: x.selection, floating: x.floating, doc: x.doc, repeat: x.doc.repeat })),
  );
  const set = useEditor.setState;
  const paintSeg = (
    <Segmented<PaintMode>
      value={s.paint}
      onChange={(v) => set({ paint: v })}
      label={t.paintLabel}
      options={[
        { value: 'color', label: t.paintColor },
        { value: 'symbol', label: t.paintSymbol },
        { value: 'both', label: t.paintBoth },
      ]}
    />
  );
  const symSeg = (
    <Segmented<Symmetry>
      value={s.symmetry}
      onChange={(v) => set({ symmetry: v })}
      label={t.symmetry}
      options={[
        { value: 'none', label: t.symNone },
        { value: 'v', label: t.symV },
        { value: 'h', label: t.symH },
        { value: 'both', label: t.symBoth },
      ]}
    />
  );
  const hint = (txt: string) => <span className="chart-opt-hint">{txt}</span>;
  let body: React.ReactNode = null;
  switch (s.tool) {
    case 'pencil':
    case 'eraser':
    case 'fill':
    case 'line':
      body = (
        <>
          {paintSeg}
          <span className="chart-opt-label">{t.symmetry}</span>
          {symSeg}
        </>
      );
      break;
    case 'rect':
      body = (
        <>
          {paintSeg}
          <Segmented<'o' | 'f'>
            value={s.rectFilled ? 'f' : 'o'}
            onChange={(v) => set({ rectFilled: v === 'f' })}
            label={t.toolRect}
            options={[
              { value: 'o', label: t.rectOutline },
              { value: 'f', label: t.rectFilled },
            ]}
          />
          <span className="chart-opt-label">{t.symmetry}</span>
          {symSeg}
        </>
      );
      break;
    case 'picker':
      body = hint(t.pickerHint);
      break;
    case 'hand':
      body = hint(t.handHint);
      break;
    case 'text':
      body = (
        <>
          <input
            className="input chart-stamp-input"
            value={s.stampText}
            maxLength={24}
            placeholder={t.textPlaceholder}
            aria-label={t.textLabel}
            onChange={(e) => set({ stampText: e.target.value })}
          />
          {paintSeg}
          {hint(t.stampHint)}
        </>
      );
      break;
    case 'repeat':
      body = (
        <>
          {hint(t.repeatHint)}
          {s.repeat && onTilePreview && (
            <button className="btn btn-soft btn-sm" onClick={onTilePreview}>
              <LayoutGrid /> {t.tilePreview}
            </button>
          )}
          {s.repeat && (
            <button className="btn btn-ghost btn-sm" onClick={() => applyDoc({ ...snapshot(s.doc), repeat: undefined })}>
              <X /> {t.clearRepeat}
            </button>
          )}
        </>
      );
      break;
    case 'select': {
      const has = !!s.selection || !!s.floating;
      const btn = (Icon: LucideIcon, label: string, fn: () => void, disabled = false) => (
        <button className="btn btn-ghost btn-sm btn-icon" onClick={fn} disabled={disabled} aria-label={label} title={label}>
          <Icon />
        </button>
      );
      body = (
        <>
          {s.floating ? (
            <button className="btn btn-primary btn-sm" onClick={deselect}>
              <Check /> {t.place}
            </button>
          ) : (
            hint(has ? '' : t.selectHint)
          )}
          {btn(Copy, t.copy, () => copySel(), !has)}
          {btn(Scissors, t.cut, cutSel, !has)}
          {btn(ClipboardPaste, t.paste, pasteClip)}
          {btn(FlipHorizontal2, t.flipH, flipSelH, !has)}
          {btn(FlipVertical2, t.flipV, flipSelV, !has)}
          {btn(RotateCw, t.rotate, rotateSel, !has)}
          {btn(Trash2, t.clearSel, clearSel, !has)}
          {has && !s.floating && btn(X, t.deselect, deselect)}
          {s.floating && hint(t.floatingHint)}
        </>
      );
      break;
    }
  }
  return (
    <div className="chart-opts" role="group" aria-label={t[TOOLS.find((x) => x.id === s.tool)!.label] as string}>
      {body}
    </div>
  );
}
