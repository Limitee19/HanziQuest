import React, { useState, useEffect } from 'react';
import { NavTab } from '@/types';
import { GlobalSearchModal } from '@/components/search/GlobalSearchModal';
import { clickTick } from '@/lib/fx';
import { usePrefs } from '@/lib/prefs';
import { lockGatekeeper, isGatekeeperConfigured } from '@/services/auth/gatekeeperService';

interface MainLayoutProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onNavigateTarget?: (tab: NavTab, entityId?: string) => void;
  children: React.ReactNode;
}

export function MainLayout({ activeTab, setActiveTab, onNavigateTarget, children }: MainLayoutProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { sound, arcade, toggleSound, toggleArcade } = usePrefs();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    const handleOpenDrill = () => setActiveTab('drill');
    const handleOpenLeech = () => setActiveTab('leech');
    const handleOpenGarden = () => setActiveTab('garden');

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open_drill_modal', handleOpenDrill);
    window.addEventListener('open_leech_modal', handleOpenLeech);
    window.addEventListener('open_garden_modal', handleOpenGarden);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open_drill_modal', handleOpenDrill);
      window.removeEventListener('open_leech_modal', handleOpenLeech);
      window.removeEventListener('open_garden_modal', handleOpenGarden);
    };
  }, [setActiveTab]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--ink)',
        background: 'var(--bg)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      {/* ── TOPBAR NAV Khas Hanzi Quest ── */}
      <div style={{ maxWidth: 1400, width: '100%', margin: '0 auto', padding: '0 16px' }}>
        <header className="topbar">
          {/* Brand Seal & Title */}
          <div
            className="brand"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              clickTick(sound);
              setActiveTab('dashboard');
            }}
          >
            <div className="chop">字</div>
            <div className="brand-text">
              <span className="brand-title">Hanzi Quest</span>
              <span className="brand-sub">Petualangan Hanzi HSK</span>
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="nav">
            <button
              type="button"
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => {
                clickTick(sound);
                setActiveTab('dashboard');
              }}
            >
              <i className="ph-duotone ph-map-trifold" />
              Peta
            </button>

            <button
              type="button"
              className={activeTab === 'drill' ? 'active' : ''}
              onClick={() => {
                clickTick(sound);
                setActiveTab('drill');
              }}
            >
              <i className="ph-duotone ph-lightning" />
              Drill
            </button>

            <button
              type="button"
              className={activeTab === 'leech' ? 'active' : ''}
              onClick={() => {
                clickTick(sound);
                setActiveTab('leech');
              }}
            >
              <i className="ph-duotone ph-bug-beetle" />
              Leech
            </button>

            <button
              type="button"
              className={activeTab === 'garden' ? 'active' : ''}
              onClick={() => {
                clickTick(sound);
                setActiveTab('garden');
              }}
            >
              <i className="ph-duotone ph-plant" />
              Kebun
            </button>

            <button
              type="button"
              className={activeTab === 'vocab' ? 'active' : ''}
              onClick={() => {
                clickTick(sound);
                setActiveTab('vocab');
              }}
            >
              <i className="ph-duotone ph-book-open-text" />
              Kosakata
            </button>

            <button
              type="button"
              className={activeTab === 'chinese_learning' ? 'active' : ''}
              onClick={() => {
                clickTick(sound);
                setActiveTab('chinese_learning');
              }}
            >
              <i className="ph-duotone ph-books" />
              Modul Belajar
            </button>

            <button
              type="button"
              className={activeTab === 'ai_assistant' ? 'active' : ''}
              onClick={() => {
                clickTick(sound);
                setActiveTab('ai_assistant');
              }}
            >
              <i className="ph-duotone ph-robot" />
              Tutor AI
            </button>
          </nav>

          {/* Right Controls: Sound, Arcade, Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Search */}
            <button
              type="button"
              className="btn btn--ghost"
              style={{ padding: '8px 12px', fontSize: 13, borderRadius: '9999px' }}
              onClick={() => {
                clickTick(sound);
                setIsSearchOpen(true);
              }}
              title="Cari Kosakata (Ctrl+K)"
            >
              <i className="ph-duotone ph-magnifying-glass" style={{ color: 'var(--ink-soft)' }} />
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              className={`btn btn--ghost ${sound ? 'btn--sound-on' : ''}`}
              style={{
                padding: '8px 12px',
                fontSize: 13,
                borderRadius: '9999px',
              }}
              onClick={toggleSound}
              title={sound ? 'Audio Suara Aktif' : 'Audio Suara Bisu'}
            >
              <i
                className={`ph-duotone ${sound ? 'ph-speaker-high' : 'ph-speaker-slash'}`}
                style={{ color: sound ? 'var(--jade)' : 'var(--ink-soft)' }}
              />
            </button>

            {/* Arcade Toggle */}
            <button
              type="button"
              className={`btn btn--ghost ${arcade ? 'btn--arcade-on' : ''}`}
              style={{
                padding: '8px 12px',
                fontSize: 13,
                borderRadius: '9999px',
              }}
              onClick={toggleArcade}
              title={arcade ? 'Mode Arkade Aktif (Bonus XP & Konfeti)' : 'Mode Santai'}
            >
              <i
                className="ph-duotone ph-joystick"
                style={{ color: arcade ? 'var(--ochre)' : 'var(--ink-soft)' }}
              />
            </button>

            {/* Settings (Pengaturan) Quick Access */}
            <button
              type="button"
              className={`btn btn--ghost ${activeTab === 'settings' ? 'active' : ''}`}
              style={{
                padding: '8px 12px',
                fontSize: 13,
                borderRadius: '9999px',
              }}
              onClick={() => {
                clickTick(sound);
                setActiveTab('settings');
              }}
              title="Pengaturan Aplikasi"
            >
              <i
                className="ph-duotone ph-gear"
                style={{ color: activeTab === 'settings' ? 'var(--cinnabar)' : 'var(--ink-soft)' }}
              />
            </button>

            {/* Quick Lock Application */}
            {isGatekeeperConfigured() && (
              <button
                type="button"
                className="btn btn--ghost"
                style={{
                  padding: '8px 12px',
                  fontSize: 13,
                  borderRadius: '9999px',
                }}
                onClick={() => {
                  clickTick(sound);
                  lockGatekeeper();
                }}
                title="Kunci Aplikasi Sekarang"
              >
                <i
                  className="ph-duotone ph-lock-key"
                  style={{ color: 'var(--cinnabar)' }}
                />
              </button>
            )}
          </div>
        </header>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <main
        className="main-content"
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 16px 64px',
        }}
      >
        {children}
      </main>

      {/* ── MOBILE FLOATING DOCK (max-width: 900px) ── */}
      <nav className="dock">
        <button
          type="button"
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => {
            clickTick(sound);
            setActiveTab('dashboard');
          }}
        >
          <i className="ph-duotone ph-map-trifold" />
          <span>Peta</span>
        </button>

        <button
          type="button"
          className={activeTab === 'drill' ? 'active' : ''}
          onClick={() => {
            clickTick(sound);
            setActiveTab('drill');
          }}
        >
          <i className="ph-duotone ph-lightning" />
          <span>Drill</span>
        </button>

        <button
          type="button"
          className={activeTab === 'leech' ? 'active' : ''}
          onClick={() => {
            clickTick(sound);
            setActiveTab('leech');
          }}
        >
          <i className="ph-duotone ph-bug-beetle" />
          <span>Leech</span>
        </button>

        <button
          type="button"
          className={activeTab === 'garden' ? 'active' : ''}
          onClick={() => {
            clickTick(sound);
            setActiveTab('garden');
          }}
        >
          <i className="ph-duotone ph-plant" />
          <span>Kebun</span>
        </button>

        <button
          type="button"
          className={activeTab === 'vocab' ? 'active' : ''}
          onClick={() => {
            clickTick(sound);
            setActiveTab('vocab');
          }}
        >
          <i className="ph-duotone ph-book-open-text" />
          <span>Kosakata</span>
        </button>

        <button
          type="button"
          className={activeTab === 'chinese_learning' ? 'active' : ''}
          onClick={() => {
            clickTick(sound);
            setActiveTab('chinese_learning');
          }}
        >
          <i className="ph-duotone ph-books" />
          <span>Belajar</span>
        </button>

        <button
          type="button"
          className={activeTab === 'ai_assistant' ? 'active' : ''}
          onClick={() => {
            clickTick(sound);
            setActiveTab('ai_assistant');
          }}
        >
          <i className="ph-duotone ph-robot" />
          <span>AI</span>
        </button>
      </nav>

      {/* ── SEARCH MODAL ── */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab, entityId) => {
          if (onNavigateTarget) {
            onNavigateTarget(tab, entityId);
          } else {
            setActiveTab(tab);
          }
          setIsSearchOpen(false);
        }}
      />
    </div>
  );
}
