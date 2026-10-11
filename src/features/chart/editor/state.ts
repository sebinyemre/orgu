/**
 * Kareli kağıt düzenleyicisinin durumu.
 *
 * Hücre dizileri sürükleme sırasında yerinde değiştirilir (React her hücrede yeniden çizilmez):
 *  - `version` canvas'ın yeniden çizilmesi için her değişiklikte artar,
 *  - `rev` yalnızca bir işlem bitince (kayıt, paneller, geri al) artar.
 */
import { create } from 'zustand';
import type { ChartDoc, ChartRect, PaletteColor } from '@/types';
import { uid } from '@/lib/id';
import { History } from '@/engine/chart/history';
import { cloneGrid, paletteLetter, pasteRegion, remapColors, type Grid, type PaintMode, type Region, type Symmetry } from '@/engine/chart/grid';

export type ToolId = 'pencil' | 'eraser' | 'fill' | 'line' | 'rect' | 'picker' | 'select' | 'hand' | 'text' | 'repeat';

export interface EditDoc extends Grid {
  palette: PaletteColor[];
  repeat?: ChartRect;
}

export interface Floating {
  x: number;
  y: number;
  region: Region;
}

export interface ViewApi {
  zoomBy: (f: number) => void;
  fit: () => void;
  /** görünen alanın ortasındaki hücre */
  centerCell: () => { x: number; y: number };
}

export interface EditorState {
  id: string | null;
  doc: EditDoc;
  version: number;
  rev: number;
  tool: ToolId;
  /** damlalıktan sonra dönülecek araç */
  lastTool: ToolId;
  paint: PaintMode;
  color: number;
  symbol: string;
  rectFilled: boolean;
  symmetry: Symmetry;
  stampText: string;
  selection: ChartRect | null;
  floating: Floating | null;
  canUndo: boolean;
  canRedo: boolean;
  /** görünen yakınlık (araç çubuğundaki yüzde için) */
  zoom: number;
}

const emptyDoc = (): EditDoc => ({ width: 1, height: 1, colors: [-1], symbols: [''], palette: [] });

export const useEditor = create<EditorState>()(() => ({
  id: null,
  doc: emptyDoc(),
  version: 0,
  rev: 0,
  tool: 'pencil',
  lastTool: 'pencil',
  paint: 'color',
  color: 1,
  symbol: 'k',
  rectFilled: false,
  symmetry: 'none',
  stampText: '',
  selection: null,
  floating: null,
  canUndo: false,
  canRedo: false,
  zoom: 1,
}));

const get = () => useEditor.getState();
const set = (p: Partial<EditorState>) => useEditor.setState(p);

/* ── Geçmiş ─────────────────────────────────────────────────────── */

const history = new History<EditDoc>(120, (d) => d.width * d.height, 3_000_000);
let pending: EditDoc | null = null;
let viewApi: ViewApi | null = null;

export function setViewApi(api: ViewApi | null): void {
  viewApi = api;
}
export const getViewApi = () => viewApi;

export function snapshot(d: EditDoc): EditDoc {
  return { ...cloneGrid(d), palette: d.palette.map((p) => ({ ...p })), repeat: d.repeat ? { ...d.repeat } : undefined };
}

function sameDoc(a: EditDoc, b: EditDoc): boolean {
  if (a.width !== b.width || a.height !== b.height || a.palette.length !== b.palette.length) return false;
  if (JSON.stringify(a.repeat ?? null) !== JSON.stringify(b.repeat ?? null)) return false;
  for (let i = 0; i < a.colors.length; i++) if (a.colors[i] !== b.colors[i] || a.symbols[i] !== b.symbols[i]) return false;
  return a.palette.every((p, i) => p.hex === b.palette[i].hex && p.name === b.palette[i].name && p.yarnId === b.palette[i].yarnId);
}

function syncHistoryFlags() {
  set({ canUndo: history.canUndo, canRedo: history.canRedo });
}

/** Grafiği düzenleyiciye yükler */
export function loadChart(c: ChartDoc): void {
  history.clear();
  pending = null;
  const color = c.palette.length > 1 ? 1 : c.palette.length ? 0 : -1;
  set({
    id: c.id,
    doc: { width: c.width, height: c.height, colors: [...c.colors], symbols: [...c.symbols], palette: c.palette.map((p) => ({ ...p })), repeat: c.repeat ? { ...c.repeat } : undefined },
    version: get().version + 1,
    rev: 0,
    selection: null,
    floating: null,
    canUndo: false,
    canRedo: false,
    color,
    paint: c.symbols.some((s) => s && s !== 'k') && !c.colors.some((x) => x > 0) ? 'symbol' : 'color',
    symbol: c.craft === 'crochet' ? 'sc' : 'p',
  });
}

/** Bir düzenleme başlar (sürükleme, kova…): önceki durum saklanır */
export function beginEdit(): void {
  if (!pending) pending = snapshot(get().doc);
}

export const isEditing = () => pending !== null;

/** Canlı değişiklik: yalnızca canvas yeniden çizilir */
export function touch(): void {
  set({ version: get().version + 1 });
}

/** Düzenleme biter: değiştiyse geçmişe yazılır */
export function commitEdit(): void {
  if (!pending) return;
  const before = pending;
  pending = null;
  if (sameDoc(before, get().doc)) {
    touch();
    return;
  }
  history.push(before);
  set({ version: get().version + 1, rev: get().rev + 1 });
  syncHistoryFlags();
}

/** Düzenlemeyi geri sarar (iki parmak dokunuşu gibi) */
export function cancelEdit(): void {
  if (!pending) return;
  const before = pending;
  pending = null;
  set({ doc: before, version: get().version + 1 });
}

/** Yapısal değişiklik (boyut, palet, tekrar kutusu…) */
export function applyDoc(next: EditDoc): void {
  placeFloating();
  history.push(snapshot(get().doc));
  set({ doc: next, version: get().version + 1, rev: get().rev + 1, selection: clampSel(get().selection, next) });
  syncHistoryFlags();
}

function clampSel(s: ChartRect | null, d: EditDoc): ChartRect | null {
  if (!s) return null;
  if (s.x >= d.width || s.y >= d.height) return null;
  return { x: s.x, y: s.y, w: Math.min(s.w, d.width - s.x), h: Math.min(s.h, d.height - s.y) };
}

function fixBrush(d: EditDoc) {
  const c = get().color;
  if (c >= d.palette.length) set({ color: d.palette.length - 1 });
}

export function undo(): void {
  placeFloating();
  const prev = history.undo(snapshot(get().doc));
  if (!prev) return;
  set({ doc: prev, version: get().version + 1, rev: get().rev + 1, selection: clampSel(get().selection, prev) });
  fixBrush(prev);
  syncHistoryFlags();
}

export function redo(): void {
  placeFloating();
  const next = history.redo(snapshot(get().doc));
  if (!next) return;
  set({ doc: next, version: get().version + 1, rev: get().rev + 1, selection: clampSel(get().selection, next) });
  fixBrush(next);
  syncHistoryFlags();
}

/* ── Araç ve fırça ──────────────────────────────────────────────── */

export function setTool(tool: ToolId): void {
  const s = get();
  if (tool !== 'select') placeFloating();
  set({ tool, lastTool: tool === 'picker' || tool === 'hand' ? s.lastTool : tool, selection: tool === 'select' ? s.selection : null });
}

export function pickColor(i: number): void {
  const p = get().paint;
  set({ color: i, paint: p === 'symbol' ? 'color' : p });
  const t = get().tool;
  if (t === 'eraser' || t === 'hand' || t === 'picker' || t === 'select' || t === 'repeat') setTool('pencil');
}

export function pickSymbol(id: string): void {
  const p = get().paint;
  set({ symbol: id, paint: p === 'color' ? 'symbol' : p });
  const t = get().tool;
  if (t === 'eraser' || t === 'hand' || t === 'picker' || t === 'select' || t === 'repeat' || t === 'text') setTool('pencil');
}

/* ── Seçim ve yüzen bölge ───────────────────────────────────────── */

let clipboard: Region | null = null;
export const getClipboard = () => clipboard;
export function setClipboard(r: Region | null): void {
  clipboard = r;
}

/** Yüzen bölgeyi ızgaraya yapıştırır ve düzenlemeyi kapatır */
export function placeFloating(): void {
  const f = get().floating;
  if (!f) return;
  const doc = get().doc;
  pasteRegion(doc, f.region, f.x, f.y);
  set({ floating: null, selection: clampSel({ x: Math.max(0, f.x), y: Math.max(0, f.y), w: f.region.width, h: f.region.height }, doc) });
  commitEdit();
}

/* ── Palet ──────────────────────────────────────────────────────── */

const relabel = (p: PaletteColor[]) => p.map((c, i) => ({ ...c, letter: paletteLetter(i) }));

export function addColor(hex: string, name: string, yarnId?: string): boolean {
  const d = get().doc;
  if (d.palette.length >= 26) return false;
  const palette = relabel([...d.palette, { id: uid('renk'), hex, name, letter: '', ...(yarnId ? { yarnId } : {}) }]);
  applyDoc({ ...snapshot(d), palette });
  pickColor(palette.length - 1);
  return true;
}

/** Adı değiştirir (yazarken her harfte geçmişe yazmamak için geçmişsiz) */
export function renameColor(i: number, name: string): void {
  const d = get().doc;
  const palette = d.palette.map((c, j) => (j === i ? { ...c, name } : c));
  set({ doc: { ...d, palette }, rev: get().rev + 1, version: get().version + 1 });
}

export function recolor(i: number, hex: string): void {
  const d = get().doc;
  applyDoc({ ...snapshot(d), palette: d.palette.map((c, j) => (j === i ? { ...c, hex, yarnId: undefined } : c)) });
}

export function moveColor(i: number, dir: -1 | 1): void {
  const d = get().doc;
  const j = i + dir;
  if (j < 0 || j >= d.palette.length) return;
  const map = d.palette.map((_, k) => (k === i ? j : k === j ? i : k));
  const palette = [...d.palette];
  [palette[i], palette[j]] = [palette[j], palette[i]];
  applyDoc({ ...snapshot(d), colors: remapColors(d.colors, map), palette: relabel(palette) });
  const c = get().color;
  if (c === i) set({ color: j });
  else if (c === j) set({ color: i });
}

/** Rengi siler; hücreleri `replace` rengine (ya da -1) çevirir */
export function removeColor(i: number, replace: number): void {
  const d = get().doc;
  const map = d.palette.map((_, k) => {
    const target = k === i ? replace : k;
    if (target < 0) return -1;
    return target > i ? target - 1 : target;
  });
  const palette = relabel(d.palette.filter((_, k) => k !== i));
  applyDoc({ ...snapshot(d), colors: remapColors(d.colors, map), palette });
  const c = get().color;
  set({ color: c === i ? Math.max(0, Math.min(palette.length - 1, replace >= 0 ? map[i] : 0)) : c > i ? c - 1 : c });
}

/** Düzenleyicideki belgeyi kaydedilecek alanlara çevirir */
export function docPatch(d: EditDoc): Partial<ChartDoc> {
  return { width: d.width, height: d.height, colors: [...d.colors], symbols: [...d.symbols], palette: d.palette.map((p) => ({ ...p })), repeat: d.repeat ? { ...d.repeat } : undefined };
}
