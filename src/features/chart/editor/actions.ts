/** Seçim işlemleri: kopyala, kes, yapıştır, çevir, döndür, temizle */
import { toast } from '@/store/toast';
import { getLang } from '@/i18n';
import { clearRegion, extractRegion, flipH, flipV, pasteRegion, rotate180, type Region } from '@/engine/chart/grid';
import { CH } from '../i18n';
import { beginEdit, commitEdit, getClipboard, getViewApi, placeFloating, setClipboard, setTool, touch, useEditor } from './state';

const st = () => useEditor.getState();

export function copySel(): boolean {
  const s = st();
  if (s.floating) setClipboard(s.floating.region);
  else if (s.selection) setClipboard(extractRegion(s.doc, s.selection));
  else return false;
  toast(CH[getLang()].copied);
  return true;
}

export function cutSel(): void {
  const s = st();
  if (s.floating) {
    setClipboard(s.floating.region);
    useEditor.setState({ floating: null, selection: null });
    commitEdit();
    return;
  }
  if (!s.selection) return;
  setClipboard(extractRegion(s.doc, s.selection));
  beginEdit();
  clearRegion(s.doc, s.selection);
  commitEdit();
}

export function pasteClip(): void {
  const clip = getClipboard();
  if (!clip) {
    toast(CH[getLang()].nothingToPaste);
    return;
  }
  placeFloating();
  const s = st();
  const center = getViewApi()?.centerCell?.();
  const x = s.selection ? s.selection.x : center ? Math.max(0, Math.min(s.doc.width - clip.width, center.x - Math.floor(clip.width / 2))) : 0;
  const y = s.selection ? s.selection.y : center ? Math.max(0, Math.min(s.doc.height - clip.height, center.y - Math.floor(clip.height / 2))) : 0;
  setTool('select');
  beginEdit();
  useEditor.setState({ floating: { x, y, region: clip }, selection: { x, y, w: clip.width, h: clip.height } });
  touch();
}

function transform(fn: (r: Region) => Region): void {
  const s = st();
  if (s.floating) {
    useEditor.setState({ floating: { ...s.floating, region: fn(s.floating.region) } });
    touch();
    return;
  }
  if (!s.selection) return;
  const sel = s.selection;
  beginEdit();
  const reg = extractRegion(s.doc, sel);
  clearRegion(s.doc, sel);
  pasteRegion(s.doc, fn(reg), sel.x, sel.y);
  commitEdit();
}

export const flipSelH = () => transform(flipH);
export const flipSelV = () => transform(flipV);
export const rotateSel = () => transform(rotate180);

export function clearSel(): void {
  const s = st();
  if (s.floating) {
    useEditor.setState({ floating: null, selection: null });
    commitEdit();
    return;
  }
  if (!s.selection) return;
  beginEdit();
  clearRegion(s.doc, s.selection);
  commitEdit();
}

export function deselect(): void {
  placeFloating();
  useEditor.setState({ selection: null });
}
