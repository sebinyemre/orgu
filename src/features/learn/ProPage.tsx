import { useState } from 'react';
import { CheckCircle2, KeyRound } from 'lucide-react';
import { usePro, checkGiftCode } from '@/store/pro';
import { PRO_PRICE } from '@/lib/monetization';
import { fmtDate } from '@/lib/format';
import { toast } from '@/store/toast';
import { PageHeader } from '@/ui/PageHeader';
import { YarnBall } from '@/ui/YarnBall';
import { Callout } from '@/ui/Callout';
import { useLang, useMsgs } from '@/i18n';
import { LEARN } from './i18n';
import './learn.css';

export default function ProPage() {
  const t = useMsgs(LEARN);
  const lang = useLang();
  const pro = usePro();
  const [code, setCode] = useState('');

  const redeem = () => {
    if (checkGiftCode(code)) {
      pro.unlock('code');
      toast(t.proCodeOk);
      setCode('');
    } else toast(t.proCodeBad);
  };

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <PageHeader eyebrow={t.homeEyebrow} title={t.proTitle} lede={t.proLede} />
      <div className="card pro-card stack">
        <div className="row">
          <YarnBall color="#b5523b" size={54} />
          <YarnBall color="#5f7a61" size={46} />
          <YarnBall color="#d39a2c" size={40} />
        </div>
        <ul className="pro-features">
          {t.proFeatures.map((f) => (
            <li key={f}>
              <CheckCircle2 size={20} />
              {f}
            </li>
          ))}
        </ul>
        {pro.pro ? (
          <Callout tone="tip" title={t.proActive}>
            {pro.since ? t.proActiveSince(fmtDate(pro.since)) : null}
          </Callout>
        ) : (
          <div className="stack">
            <div className="row">
              <span className="stat-value">{PRO_PRICE[lang]}</span>
            </div>
            <button className="btn btn-primary btn-lg" disabled aria-disabled="true">
              {t.proBuy}
            </button>
            <p className="small" style={{ margin: 0 }}>
              {t.proBuyNote}
            </p>
          </div>
        )}
      </div>
      {!pro.pro && (
        <div className="card" style={{ marginTop: 'var(--space-4)' }}>
          <label className="label" htmlFor="gift">
            <KeyRound size={16} style={{ verticalAlign: '-3px' }} /> {t.proCode}
          </label>
          <div className="row" style={{ marginTop: 6 }}>
            <input id="gift" className="input grow" value={code} onChange={(e) => setCode(e.target.value)} placeholder="ILMEK-XXXX" style={{ maxWidth: 260 }} />
            <button className="btn" onClick={redeem} disabled={!code.trim()}>
              {t.proCodeBtn}
            </button>
          </div>
        </div>
      )}
      <p className="hint" style={{ marginTop: 'var(--space-4)' }}>
        {t.freeIncludes}
      </p>
    </div>
  );
}
