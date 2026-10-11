/** Fotoğraftan desen: görseli seç, ilmek genişliğini ve renk sayısını ayarla, canlı önizle, grafiği oluştur. */
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ImagePlus } from 'lucide-react';
import type { Craft } from '@/types';
import { useCharts } from '@/store/charts';
import { useStash } from '@/store/stash';
import { toast } from '@/store/toast';
import { pickFile } from '@/lib/download';
import { Modal } from '@/ui/Modal';
import { Field, Stepper, Switch } from '@/ui/Field';
import { Segmented } from '@/ui/Segmented';
import { YARN_SWATCHES } from '@/knowledge/swatches';
import { cellAspect } from '@/engine/math/gauge';
import { hexToRgbTriple, quantize, resample, rgbToHexStr, rowsForImage, type ImageLike, type RGB } from '@/engine/image/quantize';
import { renderStaticChart } from '@/engine/chart/render';
import { MAX_SIZE } from '@/engine/chart/grid';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { makeFromPixels } from './create';
import { useChartTheme, useDpr } from './theme';
import { CH } from './i18n';

type Source = 'free' | 'yarn' | 'stash';

interface Loaded {
  img: ImageLike;
  url: string;
}

async function loadImage(file: File): Promise<Loaded> {
  const url = URL.createObjectURL(file);
  const el = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = url;
  });
  const max = 720;
  const s = Math.min(1, max / Math.max(el.naturalWidth, el.naturalHeight));
  const w = Math.max(1, Math.round(el.naturalWidth * s)),
    h = Math.max(1, Math.round(el.naturalHeight * s));
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(el, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h);
  return { img: { width: w, height: h, data: data.data }, url };
}

export function PhotoDialog({ onClose, onBack }: { onClose: () => void; onBack?: () => void }) {
  const t = useMsgs(CH);
  const c = useMsgs(COMMON);
  const lang = useLang();
  const nav = useNavigate();
  const yarns = useStash((s) => s.yarns);
  const theme = useChartTheme();
  const dpr = useDpr();
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [craft, setCraft] = useState<Craft>('knit');
  const [width, setWidth] = useState(50);
  const [k, setK] = useState(5);
  const [source, setSource] = useState<Source>('free');
  const [dither, setDither] = useState(false);
  const [proportional, setProportional] = useState(true);
  const previewRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => () => {
    if (loaded) URL.revokeObjectURL(loaded.url);
  }, [loaded]);

  const choose = async () => {
    const f = await pickFile('image/*');
    if (!f) return;
    try {
      setLoaded(await loadImage(f));
    } catch {
      toast(t.photoError, { tone: 'warn' });
    }
  };

  const gauge = craft === 'crochet' ? { stitches: 18, rows: 20 } : { stitches: 22, rows: 30 };
  const aspect = proportional ? cellAspect(gauge) : 1;
  const img = loaded?.img;
  const maxW = img ? Math.max(4, Math.min(MAX_SIZE, Math.floor((MAX_SIZE * img.width) / (img.height * aspect)))) : MAX_SIZE;
  const W = Math.min(width, maxW);
  const H = img ? Math.min(MAX_SIZE, rowsForImage(img.width, img.height, W, aspect)) : 0;

  const stashColors = useMemo(() => {
    const seen = new Set<string>();
    return yarns.filter((y) => y.colorHex && !seen.has(y.colorHex.toLowerCase()) && seen.add(y.colorHex.toLowerCase()));
  }, [yarns]);
  const src: Source = source === 'stash' && !stashColors.length ? 'yarn' : source;

  const params = useDeferredValue({ W, H, k, src, dither });
  const result = useMemo(() => {
    if (!img || params.H < 1) return null;
    const rgb = resample(img, params.W, params.H);
    let fixed: RGB[] | undefined;
    let meta: { hex: string; name?: string; yarnId?: string }[] | undefined;
    if (params.src === 'yarn') {
      meta = YARN_SWATCHES.map((s) => ({ hex: s.hex, name: s.name[lang] }));
      fixed = meta.map((m) => hexToRgbTriple(m.hex));
    } else if (params.src === 'stash') {
      meta = stashColors.map((y) => ({ hex: y.colorHex.toLowerCase(), name: y.colorName || `${y.brand} ${y.name}`.trim(), yarnId: y.id }));
      fixed = meta.map((m) => hexToRgbTriple(m.hex));
    }
    const q = quantize(rgb, params.W, params.H, { k: params.k, fixed, dither: params.dither });
    const hexes = q.fixedIndex && meta ? q.fixedIndex.map((i) => meta![i].hex) : q.palette.map(rgbToHexStr);
    const names = q.fixedIndex && meta ? q.fixedIndex.map((i) => meta![i].name) : undefined;
    const yarnIds = q.fixedIndex && meta ? q.fixedIndex.map((i) => meta![i].yarnId) : undefined;
    return { W: params.W, H: params.H, indices: q.indices, hexes, names, yarnIds };
  }, [img, params, stashColors, lang]);

  useEffect(() => {
    const cv = previewRef.current;
    if (!cv || !result) return;
    const box = Math.min(420, (cv.parentElement?.clientWidth ?? 360) - 8);
    const cell = Math.max(1, Math.min(box / (result.W * aspect), 320 / result.H, 16));
    const size = renderStaticChart(
      cv,
      { width: result.W, height: result.H, colors: result.indices, symbols: [], palette: result.hexes.map((hex) => ({ hex })) },
      { cell, aspect, theme, dpr, numbers: false },
    );
    cv.style.width = `${size.width}px`;
    cv.style.height = `${size.height}px`;
  }, [result, aspect, theme, dpr]);

  const create = () => {
    if (!result) return;
    const doc = makeFromPixels({ name: t.photoName, craft, lang, width: result.W, height: result.H, indices: result.indices, hexes: result.hexes, names: result.names, yarnIds: result.yarnIds, proportional });
    useCharts.getState().add(doc);
    onClose();
    nav(`/kareli/${doc.id}`);
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={t.photoTitle}
      wide
      footer={
        <>
          {onBack && (
            <button className="btn btn-ghost" onClick={onBack}>
              <ArrowLeft /> {c.back}
            </button>
          )}
          <span className="grow" />
          <button className="btn btn-primary" onClick={create} disabled={!result}>
            {t.createChart}
          </button>
        </>
      }
    >
      <div className="chart-photo">
        <div className="chart-photo-preview">
          {loaded ? (
            <>
              <div className="chart-photo-images">
                <img src={loaded.url} alt="" className="chart-photo-src" />
                <div className="chart-photo-out paper-grid">
                  <canvas ref={previewRef} />
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={choose}>
                <ImagePlus /> {t.otherPhoto}
              </button>
            </>
          ) : (
            <button className="chart-photo-drop" onClick={choose}>
              <ImagePlus aria-hidden />
              <span className="hand">{t.choosePhoto}</span>
              <span className="xsmall faint">{t.photoPrivacy}</span>
            </button>
          )}
        </div>
        <div className="stack chart-photo-controls">
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
          <Field label={t.photoWidth} hint={img ? t.photoHeight(H) : undefined}>
            <div className="row">
              <Stepper value={W} onChange={setWidth} min={4} max={maxW} ariaLabel={t.photoWidth} />
              <input type="range" min={4} max={maxW} value={W} onChange={(e) => setWidth(+e.target.value)} aria-label={t.photoWidth} style={{ flex: 1, minWidth: 120 }} />
            </div>
          </Field>
          <Field label={t.colorCount}>
            <div className="row">
              <Stepper value={k} onChange={setK} min={2} max={12} ariaLabel={t.colorCount} />
              {result && (
                <div className="row" style={{ gap: 4 }} aria-hidden>
                  {result.hexes.map((hex, i) => (
                    <span key={i} className="swatch" style={{ background: hex, width: 18, height: 18 }} />
                  ))}
                </div>
              )}
            </div>
          </Field>
          <div className="field">
            <span className="label">{t.colorSource}</span>
            <Segmented<Source>
              value={source}
              onChange={setSource}
              label={t.colorSource}
              options={[
                { value: 'free', label: t.srcFree },
                { value: 'yarn', label: t.srcYarn },
                { value: 'stash', label: t.srcStash },
              ]}
            />
            {source === 'stash' && !stashColors.length && <span className="hint">{t.stashEmpty}</span>}
          </div>
          <Switch checked={dither} onChange={setDither} label={t.dither} hint={t.ditherHint} />
          <Switch checked={proportional} onChange={setProportional} label={t.photoProportional} hint={t.photoProportionalHint} />
        </div>
      </div>
    </Modal>
  );
}
