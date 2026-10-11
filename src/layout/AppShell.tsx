import { Suspense, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, Settings } from 'lucide-react';
import { ALL_ITEMS, BOTTOM_NAV, NAV, SETTINGS_ITEM } from './nav';
import { Logo } from '@/ui/Logo';
import { Modal } from '@/ui/Modal';
import { YarnBall } from '@/ui/YarnBall';
import './shell.css';

/** Kabuğu gizleyen tam ekran rotalar */
const CHROMELESS = [/^\/kareli\/[^/]+\/takip$/, /^\/ders\/[^/]+$/];

export function PageLoading() {
  return (
    <div className="page-loading" aria-label="Yükleniyor">
      <YarnBall color="#b5523b" size={56} tail={false} />
    </div>
  );
}

export function AppShell() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const chromeless = CHROMELESS.some((r) => r.test(pathname));
  const current = [...ALL_ITEMS].sort((a, b) => b.to.length - a.to.length).find((i) => (i.to === '/' ? pathname === '/' : pathname.startsWith(i.to)));

  return (
    <div className={`shell${chromeless ? ' chromeless' : ''}`}>
      <aside className="sidebar no-print" aria-label="Ana menü">
        <NavLink to="/" className="brand">
          <Logo size={42} />
          <div>
            <div className="brand-name">İlmek İlmek</div>
            <div className="brand-sub">örgü atölyesi</div>
          </div>
        </NavLink>
        <nav>
          {NAV.map((g, i) => (
            <div className="nav-group" key={i}>
              {g.title && <div className="nav-group-title">{g.title}</div>}
              {g.items.map((it) => (
                <NavLink key={it.to} to={it.to} end={it.end} className="nav-link">
                  <it.icon />
                  {it.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-foot">
          <NavLink to={SETTINGS_ITEM.to} className="nav-link">
            <Settings />
            {SETTINGS_ITEM.label}
          </NavLink>
        </div>
      </aside>

      <header className="topbar no-print">
        <NavLink to="/" className="brand" aria-label="Atölye">
          <Logo size={32} />
        </NavLink>
        <div className="grow">
          <div className="brand-name" style={{ fontSize: '1.05rem' }}>
            {current && current.to !== '/' ? current.label : 'İlmek İlmek'}
          </div>
          <div className="brand-sub">{current && current.to !== '/' ? 'İlmek İlmek' : 'örgü atölyesi'}</div>
        </div>
        <NavLink to="/ayarlar" className="btn btn-ghost btn-icon" aria-label="Ayarlar">
          <Settings />
        </NavLink>
      </header>

      <main className="main" id="icerik">
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>

      <nav className="bottombar no-print" aria-label="Alt menü">
        {BOTTOM_NAV.map((to) => {
          const it = ALL_ITEMS.find((i) => i.to === to)!;
          return (
            <NavLink key={to} to={to} end={it.end}>
              <it.icon />
              {it.short ?? it.label}
            </NavLink>
          );
        })}
        <button type="button" onClick={() => setMenuOpen(true)} aria-haspopup="dialog">
          <Menu />
          Menü
        </button>
      </nav>

      <Modal open={menuOpen} onClose={() => setMenuOpen(false)} title="Menü">
        {[...NAV.slice(1), { title: 'Diğer', items: [SETTINGS_ITEM] }].map((g) => (
          <div key={g.title} style={{ marginBottom: 'var(--space-4)' }}>
            <div className="eyebrow" style={{ fontSize: '1.1rem', marginBottom: 6 }}>
              {g.title}
            </div>
            <div className="menu-grid">
              {g.items.map((it) => (
                <NavLink key={it.to} to={it.to} end={it.end} onClick={() => setMenuOpen(false)}>
                  <it.icon />
                  <span>
                    <span className="t">{it.label}</span>
                    <br />
                    <span className="d">{it.desc}</span>
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </Modal>
    </div>
  );
}
