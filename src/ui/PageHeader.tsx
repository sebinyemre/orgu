import type { ReactNode } from 'react';

interface Props {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
}

/** Sayfa başlığı: el yazısı üst başlık + büyük başlık + açıklama + eylemler */
export function PageHeader({ eyebrow, title, lede, actions }: Props) {
  return (
    <header className="page-header">
      <div className="grow">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
      </div>
      {actions && <div className="row">{actions}</div>}
    </header>
  );
}
