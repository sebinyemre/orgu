import { useState } from 'react';
import { Hand } from 'lucide-react';
import { useSettings } from '@/store/settings';
import { Modal } from '@/ui/Modal';
import { YarnBall } from '@/ui/YarnBall';
import { TrabzanChooser } from './TrabzanChooser';

/** İlk açılışta: trabzan adlandırma sistemi ve el tercihi */
export function Onboarding() {
  const onboarded = useSettings((s) => s.onboarded);
  const leftHanded = useSettings((s) => s.leftHanded);
  const set = useSettings((s) => s.set);
  const [step, setStep] = useState(0);
  if (onboarded) return null;
  const finish = () => set({ onboarded: true });

  return (
    <Modal open onClose={finish} sheet>
      {step === 0 ? (
        <div className="stack" style={{ textAlign: 'center', alignItems: 'center' }}>
          <div className="row" style={{ justifyContent: 'center', gap: 0 }}>
            <YarnBall color="#b5523b" size={64} />
            <YarnBall color="#d39a2c" size={52} />
            <YarnBall color="#5f7a61" size={60} />
          </div>
          <div className="eyebrow">hoş geldin</div>
          <h2 style={{ margin: 0 }}>İlmek İlmek atölyesine</h2>
          <p className="muted" style={{ maxWidth: '44ch' }}>
            Şiş ve tığ işini sıfırdan, resimli adımlarla öğren. Başlamadan önce iki küçük ayar var.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => setStep(1)}>
            Devam
          </button>
        </div>
      ) : (
        <div className="stack">
          <div>
            <div className="eyebrow">1 · trabzanlar</div>
            <h3 style={{ marginBottom: 4 }}>Trabzanları nasıl adlandırıyorsun?</h3>
            <p className="muted small" style={{ margin: 0 }}>
              Türkçe tariflerde iki ayrı adlandırma kullanılır. Hangisini seçersen seç, her terimin yanında ip atma sayısı ve İngilizce kısaltması da yazar. Ayarlardan sonra değiştirebilirsin.
            </p>
          </div>
          <TrabzanChooser />
          <div>
            <div className="eyebrow">2 · elin</div>
            <div className="seg" role="group" aria-label="El tercihi">
              <button aria-pressed={!leftHanded} onClick={() => set({ leftHanded: false })}>
                <Hand style={{ transform: 'scaleX(-1)' }} /> Sağ elimle örüyorum
              </button>
              <button aria-pressed={leftHanded} onClick={() => set({ leftHanded: true })}>
                <Hand /> Solağım
              </button>
            </div>
            <p className="hint" style={{ marginTop: 6 }}>
              Solak modunda bütün çizimler ve animasyonlar aynalanır.
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={finish}>
              Derslere başla
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
