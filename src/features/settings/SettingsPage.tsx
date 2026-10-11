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
import { TrabzanChooser } from './TrabzanChooser';
import type { ThemeSetting, Units } from '@/types';

export default function SettingsPage() {
  const s = useSettings();

  const doExport = () => {
    const d = new Date().toISOString().slice(0, 10);
    downloadJSON(exportAll(), `ilmek-ilmek-yedek-${d}.json`);
    toast('Yedek indirildi');
  };

  const doImport = async () => {
    const f = await pickFile('application/json,.json');
    if (!f) return;
    let data: unknown;
    try {
      data = JSON.parse(await f.text());
    } catch {
      toast('Dosya okunamadı');
      return;
    }
    if (!(await confirmDialog('Yedekteki veriler şu anki projelerinin, iplerinin ve grafiklerinin yerine geçecek.', { title: 'Yedek geri yüklensin mi?', confirmLabel: 'Geri yükle', danger: true }))) return;
    const r = importAll(data);
    toast(r.ok ? 'Yedek geri yüklendi' : r.error);
  };

  const wipe = async () => {
    if (!(await confirmDialog('Tüm projeler, grafikler, sayaçlar ve ip sepeti bu cihazdan silinecek. Önce yedek almanı öneririm.', { title: 'Her şey silinsin mi?', confirmLabel: 'Hepsini sil', danger: true }))) return;
    Object.keys(localStorage)
      .filter((k) => k.startsWith('ilmek.'))
      .forEach((k) => localStorage.removeItem(k));
    location.reload();
  };

  return (
    <div className="page" style={{ maxWidth: 860 }}>
      <PageHeader eyebrow="atölye" title="Ayarlar" lede="Terimler, görünüm, sayaç davranışı ve verilerinin yedeği." />

      <h2 className="section-title">Tığ terimleri</h2>
      <div className="stack">
        <TrabzanChooser />
        <Switch checked={s.showEnglish} onChange={(v) => s.set({ showEnglish: v })} label="İngilizce kısaltmaları da göster" hint="Terimlerin yanında küçük bir 'US dc' etiketi görünür. İngilizce tarif okurken işe yarar." />
        <Callout tone="prof">
          Bir tarifte "trabzan" gördüğünde ilk soru şudur: <b>kaç kez ip atılıyor?</b> İngilizce tariflerde de US ve UK adları farklıdır (US "single crochet" = UK "double crochet"). Bu yüzden atölyede her terimin yanında ip atma sayısını görürsün.
        </Callout>
      </div>

      <h2 className="section-title">Görünüm</h2>
      <div className="stack">
        <div className="field">
          <span className="label">Tema</span>
          <Segmented<ThemeSetting>
            value={s.theme}
            onChange={(v) => s.set({ theme: v })}
            options={[
              { value: 'auto', label: <><SunMoon /> Otomatik</> },
              { value: 'light', label: <><Sun /> Gündüz</> },
              { value: 'dark', label: <><Moon /> Gece örgüsü</> },
            ]}
          />
        </div>
        <div className="field">
          <span className="label">Ölçü birimi</span>
          <Segmented<Units>
            value={s.units}
            onChange={(v) => s.set({ units: v })}
            options={[
              { value: 'cm', label: 'Santimetre' },
              { value: 'in', label: 'İnç' },
            ]}
          />
        </div>
        <Switch checked={s.leftHanded} onChange={(v) => s.set({ leftHanded: v })} label="Solak modu" hint="Ders animasyonları aynalanır." />
        <div className="field" style={{ maxWidth: 360 }}>
          <span className="label">Animasyon hızı: {s.animSpeed.toLocaleString('tr-TR')}×</span>
          <input type="range" min={0.5} max={2} step={0.25} value={s.animSpeed} onChange={(e) => s.set({ animSpeed: Number(e.target.value) })} />
        </div>
      </div>

      <h2 className="section-title">Sayaçlar ve takip</h2>
      <div className="stack">
        <Switch checked={s.counterSound} onChange={(v) => s.set({ counterSound: v })} label="Tık sesi" hint="Mekanik sayaç gibi küçük bir tık." />
        <Switch checked={s.counterVibrate} onChange={(v) => s.set({ counterVibrate: v })} label="Titreşim" hint="Destekleyen telefonlarda her artışta kısa titreşim; hatırlatıcıda uzun." />
        <Switch checked={s.keepAwake} onChange={(v) => s.set({ keepAwake: v })} label="Takip modunda ekranı açık tut" hint="Elin şişteyken telefon kararmasın." />
      </div>

      <h2 className="section-title">Verilerin</h2>
      <Callout tone="info">Her şey yalnızca bu cihazda, tarayıcında saklanır. Telefon değiştirirken ya da tarayıcı verisini silmeden önce yedek al.</Callout>
      <div className="row" style={{ marginTop: 'var(--space-3)' }}>
        <button className="btn btn-primary" onClick={doExport}>
          <Download /> Yedek indir
        </button>
        <button className="btn" onClick={doImport}>
          <Upload /> Yedekten geri yükle
        </button>
        <button className="btn btn-danger" onClick={wipe}>
          <RotateCcw /> Her şeyi sıfırla
        </button>
      </div>
      <p className="hint" style={{ marginTop: 'var(--space-3)' }}>
        Not: Proje fotoğrafları cihazda ayrı bir alanda tutulur ve yedek dosyasına dahil edilmez.
      </p>
    </div>
  );
}
