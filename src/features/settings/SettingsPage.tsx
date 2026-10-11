import { Download, Moon, RotateCcw, Sun, SunMoon, Upload } from 'lucide-react';
import { useSettings } from '@/store/settings';
import { exportAll, importAll } from '@/store/backup';
import { downloadJSON, pickFile } from '@/lib/download';
import { toast } from '@/store/toast';
import { confirmDialog } from '@/ui/Confirm';
import { PageHeader } from '@/ui/PageHeader';
import { Segmented } from '@/ui/Segmented';
import { Switch } from '@/ui/Field';
import { Callout } from '@/ui/Callout';
import { useLang, useMsgs } from '@/i18n';
import { CrochetTermsChooser } from './CrochetTermsChooser';
import { LanguagePicker } from './LanguagePicker';
import { SET } from './i18n';
import type { ThemeSetting, Units } from '@/types';

export default function SettingsPage() {
  const s = useSettings();
  const t = useMsgs(SET);
  const lang = useLang();

  const doExport = () => {
    const d = new Date().toISOString().slice(0, 10);
    downloadJSON(exportAll(), `ilmek-ilmek-${d}.json`);
    toast(t.exported);
  };

  const doImport = async () => {
    const f = await pickFile('application/json,.json');
    if (!f) return;
    let data: unknown;
    try {
      data = JSON.parse(await f.text());
    } catch {
      toast(t.readError);
      return;
    }
    if (!(await confirmDialog(t.importText, { title: t.importTitle, confirmLabel: t.importConfirm, danger: true }))) return;
    const r = importAll(data);
    toast(r.ok ? t.imported : t.readError);
    // açık sayfalardaki depolar eski veriyi geri yazmasın: yeniden yükle
    if (r.ok) setTimeout(() => location.reload(), 900);
  };

  const wipe = async () => {
    if (!(await confirmDialog(t.wipeText, { title: t.wipeTitle, confirmLabel: t.wipeConfirm, danger: true }))) return;
    Object.keys(localStorage)
      .filter((k) => k.startsWith('ilmek.'))
      .forEach((k) => localStorage.removeItem(k));
    location.reload();
  };

  return (
    <div className="page" style={{ maxWidth: 860 }}>
      <PageHeader title={t.title} lede={t.lede} />

      <h2 className="section-title">{t.language}</h2>
      <LanguagePicker />

      <h2 className="section-title">{t.crochetTerms}</h2>
      <div className="stack">
        <CrochetTermsChooser />
        <Switch checked={s.showEnglish} onChange={(v) => s.set({ showEnglish: v })} label={t.showEnglish} hint={t.showEnglishHint} />
        <Callout tone="prof">{t.profNote}</Callout>
      </div>

      <h2 className="section-title">{t.appearance}</h2>
      <div className="stack">
        <div className="field">
          <span className="label">{t.theme}</span>
          <Segmented<ThemeSetting>
            value={s.theme}
            onChange={(v) => s.set({ theme: v })}
            options={[
              { value: 'auto', label: <><SunMoon /> {t.themeAuto}</> },
              { value: 'light', label: <><Sun /> {t.themeLight}</> },
              { value: 'dark', label: <><Moon /> {t.themeDark}</> },
            ]}
          />
        </div>
        <div className="field">
          <span className="label">{t.units}</span>
          <Segmented<Units>
            value={s.units}
            onChange={(v) => s.set({ units: v })}
            options={[
              { value: 'cm', label: t.unitsCm },
              { value: 'in', label: t.unitsIn },
            ]}
          />
        </div>
        <Switch checked={s.leftHanded} onChange={(v) => s.set({ leftHanded: v })} label={t.leftHanded} hint={t.leftHandedHint} />
        <div className="field" style={{ maxWidth: 360 }}>
          <span className="label">{t.animSpeed(s.animSpeed.toLocaleString(lang))}</span>
          <input type="range" min={0.5} max={2} step={0.25} value={s.animSpeed} onChange={(e) => s.set({ animSpeed: Number(e.target.value) })} />
        </div>
      </div>

      <h2 className="section-title">{t.countersTitle}</h2>
      <div className="stack">
        <Switch checked={s.counterSound} onChange={(v) => s.set({ counterSound: v })} label={t.sound} hint={t.soundHint} />
        <Switch checked={s.counterVibrate} onChange={(v) => s.set({ counterVibrate: v })} label={t.vibrate} hint={t.vibrateHint} />
        <Switch checked={s.keepAwake} onChange={(v) => s.set({ keepAwake: v })} label={t.keepAwake} hint={t.keepAwakeHint} />
      </div>

      <h2 className="section-title">{t.data}</h2>
      <Callout tone="info">{t.dataInfo}</Callout>
      <div className="row" style={{ marginTop: 'var(--space-3)' }}>
        <button className="btn btn-primary" onClick={doExport}>
          <Download /> {t.exportBtn}
        </button>
        <button className="btn" onClick={doImport}>
          <Upload /> {t.importBtn}
        </button>
        <button className="btn btn-danger" onClick={wipe}>
          <RotateCcw /> {t.wipeBtn}
        </button>
      </div>
      <p className="hint" style={{ marginTop: 'var(--space-3)' }}>
        {t.photosNote}
      </p>
    </div>
  );
}
