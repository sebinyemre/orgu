import { useState, type ReactNode } from 'react';
import { Shirt } from 'lucide-react';
import { useLang, useMsgs } from '@/i18n';
import { Callout } from '@/ui/Callout';
import { BALL_SIZES, BLANKET_SIZES, CHEST_SIZES, CIRCLE_SIZES, COWL_SIZES, FOOT_SIZES, HAT_NEGATIVE_EASE, HEAD_SIZES, SCARF_SIZES } from '@/knowledge/sizes';
import { CALC } from '../i18n';
import { CalcLayout, HowTo, RelatedLessons, useLen } from '../ui';

type Tab = 'bas' | 'atki' | 'battaniye' | 'boyunluk' | 'gogus' | 'ayak' | 'top' | 'daire';
const TABS: Tab[] = ['bas', 'gogus', 'ayak', 'atki', 'boyunluk', 'battaniye', 'top', 'daire'];
/** Kazak bolluk payları (cm): dar, standart, bol */
const EASE = [5, 10, 15] as const;
const SOCK_EASE = 0.1;

function Table({ head, rows }: { head: ReactNode[]; rows: ReactNode[][] }) {
  return (
    <div className="table-wrap">
      <table className="table calc-size-tbl">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className={j === 0 ? undefined : 'tabular'}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SizeTablesCalc() {
  const t = useMsgs(CALC);
  const lang = useLang();
  const len = useLen();
  const [tab, setTab] = useState<Tab>('bas');
  const s = t.size;
  const L = (cm: number) => len(cm, cm % 1 === 0 ? 0 : 1);

  let table: ReactNode = null;
  let note: ReactNode = null;
  let measure = s.measureGeneral;
  let lessons: string[] = [];
  switch (tab) {
    case 'bas':
      table = (
        <Table
          head={[s.colSize, s.colHead, s.colHatKnit, s.colHatHeight]}
          rows={HEAD_SIZES.map((h) => [h.label[lang], L(h.circumference), len(h.circumference * (1 - HAT_NEGATIVE_EASE)), L(h.hatHeight)])}
        />
      );
      note = s.noteHead;
      measure = s.measureHead;
      lessons = ['sis-ilk-bere', 'sis-misinali'];
      break;
    case 'gogus':
      table = (
        <Table head={[s.colSize, s.colChest, s.colClose, s.colStandard, s.colLoose]} rows={CHEST_SIZES.map((c) => [c.label, L(c.chest), ...EASE.map((e) => L(c.chest + e))])} />
      );
      note = s.noteChest(L(EASE[0]), L(EASE[1]), L(EASE[2]));
      measure = s.measureChest;
      break;
    case 'ayak':
      table = (
        <Table
          head={[s.colSize, s.colFootLen, s.colFootCirc, s.colSock]}
          rows={FOOT_SIZES.map((f) => [f.label[lang], L(f.footLength), L(f.footCirc), len(f.footCirc * (1 - SOCK_EASE))])}
        />
      );
      note = s.noteFoot;
      measure = s.measureFoot;
      lessons = ['sis-corap-sisi'];
      break;
    case 'atki':
      table = <Table head={[s.colSize, t.width, t.length]} rows={SCARF_SIZES.map((r) => [r.label[lang], L(r.width), L(r.length)])} />;
      break;
    case 'battaniye':
      table = <Table head={[s.colSize, t.width, t.length]} rows={BLANKET_SIZES.map((r) => [r.label[lang], L(r.width), L(r.length)])} />;
      break;
    case 'boyunluk':
      table = <Table head={[s.colSize, t.circumference, t.height]} rows={COWL_SIZES.map((r) => [r.label[lang], L(r.circumference), L(r.height)])} />;
      lessons = ['sis-misinali'];
      break;
    case 'top':
      table = <Table head={[s.colSize, t.diameter, s.colBallCirc]} rows={BALL_SIZES.map((b) => [b.label[lang], L(b.diameter), len(Math.PI * b.diameter)])} />;
      note = s.noteBall;
      lessons = ['tig-amigurumi'];
      break;
    case 'daire':
      table = <Table head={[s.colSize, t.diameter, t.circumference]} rows={CIRCLE_SIZES.map((b) => [b.label[lang], L(b.diameter), len(Math.PI * b.diameter)])} />;
      lessons = ['tig-daire'];
      break;
  }

  return (
    <CalcLayout
      id="beden"
      icon={<Shirt />}
      result={
        <div className="stack">
          {note && <Callout tone="info">{note}</Callout>}
          <HowTo>{measure}</HowTo>
          <p className="small faint" style={{ margin: 0 }}>
            {s.source}
          </p>
        </div>
      }
      after={<RelatedLessons ids={lessons} />}
    >
      <div className="stack">
        <div className="calc-chips" role="tablist" aria-label={t.calcs.beden.title}>
          {TABS.map((id) => (
            <button key={id} type="button" role="tab" className="chip" aria-pressed={tab === id} aria-selected={tab === id} onClick={() => setTab(id)}>
              {s.tabs[id]}
            </button>
          ))}
        </div>
        {table}
      </div>
    </CalcLayout>
  );
}
