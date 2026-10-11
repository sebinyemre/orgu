import { useState } from 'react';
import { Hand } from 'lucide-react';
import { useSettings } from '@/store/settings';
import { Modal } from '@/ui/Modal';
import { YarnBall } from '@/ui/YarnBall';
import { useLang, useMsgs } from '@/i18n';
import { CrochetTermsChooser } from './CrochetTermsChooser';
import { LanguagePicker } from './LanguagePicker';
import { SET } from './i18n';
import { COMMON } from '@/i18n/common';

/** İlk açılış: dil, tığ terimleri, el tercihi */
export function Onboarding() {
  const onboarded = useSettings((s) => s.onboarded);
  const leftHanded = useSettings((s) => s.leftHanded);
  const set = useSettings((s) => s.set);
  const lang = useLang();
  const t = useMsgs(SET);
  const c = useMsgs(COMMON);
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
          <div className="eyebrow">{t.welcome}</div>
          <h2 style={{ margin: 0 }}>{t.welcomeTitle}</h2>
          <p className="muted" style={{ maxWidth: '44ch', margin: 0 }}>
            {t.welcomeText}
          </p>
          <div className="label" style={{ marginTop: 'var(--space-2)' }}>
            {t.chooseLanguage}
          </div>
          <LanguagePicker big />
          <button className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-2)' }} onClick={() => setStep(1)}>
            {c.continue}
          </button>
        </div>
      ) : (
        <div className="stack">
          <div>
            <div className="eyebrow">{t.step1}</div>
            <h3 style={{ marginBottom: 4 }}>{t.step1Title}</h3>
            <p className="muted small" style={{ margin: 0 }}>
              {lang === 'tr' ? t.step1TextTr : t.step1TextOther}
            </p>
          </div>
          <CrochetTermsChooser />
          <div>
            <div className="eyebrow">{t.step2}</div>
            <div className="seg" role="group">
              <button aria-pressed={!leftHanded} onClick={() => set({ leftHanded: false })}>
                <Hand style={{ transform: 'scaleX(-1)' }} /> {t.rightHanded}
              </button>
              <button aria-pressed={leftHanded} onClick={() => set({ leftHanded: true })}>
                <Hand /> {t.leftHandedBtn}
              </button>
            </div>
            <p className="hint" style={{ marginTop: 6 }}>
              {t.handHint}
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={finish}>
              {t.startLessons}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
