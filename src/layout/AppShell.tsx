import { Suspense, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, Scissors, Settings } from 'lucide-react';
import { ALL_ITEMS, BOTTOM_NAV, CREATE_NAV, LEARN_NAV, worldOf, type World } from './nav';
import { Logo } from '@/ui/Logo';
import { Modal } from '@/ui/Modal';
import { YarnBall } from '@/ui/YarnBall';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import './shell.css';

/** Kabuğu gizleyen tam ekran rotalar */
const CHROMELESS = [/^\/kareli\/[^/]+\/takip$/, /^\/ders\/[^/]+$/];

const LAST_KEY = 'ilmek.sonRota';

function readLast(): Record<World, string> {
  try {
    return { learn: '/', create: '/yarat', ...JSON.parse(localStorage.getItem(LAST_KEY) ?? '{}') };
  } catch {
    return { learn: '/', create: '/yarat' };
  }
}

export function PageLoading() {
  const t = useMsgs(COMMON);
  return (
    <div className="page-loading" aria-label={t.loading}>
      <YarnBall color="#b5523b" size={56} tail={false} />
    </div>
  );
}

/** Öğren / Yarat geçiş düğmesi */
function WorldSwitch({ world, compact }: { world: World; compact?: boolean }) {
  const t = useMsgs(COMMON);
  const nav = useNavigate();
  const go = (w: World) => {
    if (w === world) return;
    nav(readLast()[w]);
  };
  return (
    <div className={`world-switch${compact ? ' compact' : ''}`} role="tablist" aria-label={`${t.worldLearn} / ${t.worldCreate}`}>
      <button role="tab" aria-selected={world === 'learn'} data-w="learn" onClick={() => go('learn')}>
        <GraduationCap />
        <span>{t.worldLearn}</span>
      </button>
      <button role="tab" aria-selected={world === 'create'} data-w="create" onClick={() => go('create')}>
        <Scissors />
        <span>{t.worldCreate}</span>
      </button>
    </div>
  );
}

export function AppShell() {
  const t = useMsgs(COMMON);
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const routeWorld = worldOf(pathname);
  const [world, setWorld] = useState<World>(routeWorld ?? 'learn');
  useEffect(() => {
    if (!routeWorld) return;
    setWorld(routeWorld);
    try {
      localStorage.setItem(LAST_KEY, JSON.stringify({ ...readLast(), [routeWorld]: pathname }));
    } catch {
      /* yoksay */
    }
  }, [routeWorld, pathname]);

  // modallar kabuğun dışına (body) açılır; vurgu rengi onlara da geçsin
  useEffect(() => {
    document.documentElement.dataset.world = world;
  }, [world]);

  const chromeless = CHROMELESS.some((r) => r.test(pathname));
  const groups = world === 'learn' ? LEARN_NAV : CREATE_NAV;
  const current = [...ALL_ITEMS].sort((a, b) => b.to.length - a.to.length).find((i) => (i.to === '/' ? pathname === '/' : pathname.startsWith(i.to)));

  return (
    <div className={`shell${chromeless ? ' chromeless' : ''}`} data-world={world}>
      <aside className="sidebar no-print" aria-label={t.navMenu}>
        <NavLink to="/" className="brand">
          <Logo size={42} />
          <div>
            <div className="brand-name">{t.appName}</div>
            <div className="brand-sub">{t.appTagline}</div>
          </div>
        </NavLink>
        <WorldSwitch world={world} />
        <nav>
          {groups.map((g, i) => (
            <div className="nav-group" key={i}>
              {g.title && <div className="nav-group-title">{t[g.title]}</div>}
              {g.items.map((it) => (
                <NavLink key={it.to} to={it.to} end={it.end} className="nav-link">
                  <it.icon />
                  {t[it.label]}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-foot">
          <NavLink to="/ayarlar" className="nav-link">
            <Settings />
            {t.navSettings}
          </NavLink>
        </div>
      </aside>

      <header className="topbar no-print">
        <NavLink to={world === 'learn' ? '/' : '/yarat'} className="brand" aria-label={t.appName}>
          <Logo size={30} />
        </NavLink>
        <div className="grow topbar-title">{current ? t[current.label] : t.appName}</div>
        <WorldSwitch world={world} compact />
        <NavLink to="/ayarlar" className="btn btn-ghost btn-icon" aria-label={t.navSettings}>
          <Settings />
        </NavLink>
      </header>

      <main className="main" id="icerik">
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>

      <nav className="bottombar no-print" aria-label={t.navMenu} style={{ gridTemplateColumns: `repeat(${BOTTOM_NAV[world].length + 1}, 1fr)` }}>
        {BOTTOM_NAV[world].map((to) => {
          const it = ALL_ITEMS.find((i) => i.to === to)!;
          return (
            <NavLink key={to} to={to} end={it.end}>
              <it.icon />
              {t[it.short ?? it.label]}
            </NavLink>
          );
        })}
        <button type="button" onClick={() => setMenuOpen(true)} aria-haspopup="dialog">
          <Menu />
          {t.navMenu}
        </button>
      </nav>

      <Modal open={menuOpen} onClose={() => setMenuOpen(false)} title={t.navMenu}>
        {(
          [
            ['learn', LEARN_NAV],
            ['create', CREATE_NAV],
          ] as const
        ).map(([w, gs]) => (
          <div key={w} style={{ marginBottom: 'var(--space-4)' }}>
            <div className="eyebrow" style={{ fontSize: '1.15rem', marginBottom: 6 }}>
              {w === 'learn' ? t.worldLearn : t.worldCreate}
            </div>
            <div className="menu-grid">
              {gs
                .flatMap((g) => g.items)
                .map((it) => (
                  <NavLink key={it.to} to={it.to} end={it.end} onClick={() => setMenuOpen(false)}>
                    <it.icon />
                    <span>
                      <span className="t">{t[it.label]}</span>
                      <br />
                      {it.desc && <span className="d">{t[it.desc]}</span>}
                    </span>
                  </NavLink>
                ))}
            </div>
          </div>
        ))}
        <div className="menu-grid">
          <NavLink to="/ayarlar" onClick={() => setMenuOpen(false)}>
            <Settings />
            <span>
              <span className="t">{t.navSettings}</span>
              <br />
              <span className="d">{t.descSettings}</span>
            </span>
          </NavLink>
        </div>
      </Modal>
    </div>
  );
}
