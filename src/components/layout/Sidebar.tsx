import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Languages,
  Bot,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Database,
} from 'lucide-react';
import type { NavTab } from '@/types';
import { cn } from '@/lib/utils';
import { t, subscribeLanguageChange } from '@/services/localizationService';
import logoImg from '@/assets/logo.png';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavGroup {
  groupKey: string;
  items: {
    id: NavTab;
    labelKey: string;
    icon: React.ElementType;
  }[];
}

export const navGroups: NavGroup[] = [
  {
    groupKey: 'nav.home',
    items: [
      { id: 'dashboard', labelKey: 'tab.dashboard', icon: LayoutDashboard },
      { id: 'chinese_learning', labelKey: 'tab.chinese_learning', icon: Languages },
      { id: 'ai_assistant', labelKey: 'tab.ai_assistant', icon: Bot },
    ],
  },
  {
    groupKey: 'nav.secure',
    items: [
      { id: 'settings', labelKey: 'tab.settings', icon: SettingsIcon },
    ],
  },
];

/**
 * V4 label grup — mono uppercase + hairline ke kanan: gaya indeks arsip.
 */
function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-3 pt-1 pb-1">
      <span className="text-[10px] font-mono font-medium uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500 shrink-0">
        {children}
      </span>
      <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

export function Sidebar({ activeTab, setActiveTab, isMobileOpen, onCloseMobile }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [, setLangTick] = useState(0);

  useEffect(() => {
    return subscribeLanguageChange(() => setLangTick((prev) => prev + 1));
  }, []);

  return (
    <>
      {/* 1. DESKTOP SIDEBAR — panel solid, bukan kaca blur. Laci kiri sang meja kerja. */}
      <aside
        className={cn(
          'hidden md:flex relative flex-col h-screen border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 transition-all duration-300 z-20 select-none shrink-0',
          collapsed ? 'w-16' : 'w-60 lg:w-64'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-white dark:bg-zinc-800 p-0.5 border border-zinc-200 dark:border-zinc-700">
                <img src={logoImg} alt="OmniLife Logo" className="w-full h-full object-contain rounded-md" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display font-extrabold text-[15px] tracking-tight text-zinc-900 dark:text-zinc-100 truncate leading-tight">
                  OmniLife
                </span>
                <span className="text-[9px] font-mono font-medium uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500 -mt-0.5 truncate">
                  Mandarin Learning OS
                </span>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="flex items-center justify-center w-full">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg overflow-hidden bg-white dark:bg-zinc-800 p-0.5 border border-zinc-200 dark:border-zinc-700">
                <img src={logoImg} alt="OmniLife Logo" className="w-full h-full object-contain rounded-md" />
              </div>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-18 flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors z-30 cursor-pointer"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2.5 space-y-3 overflow-y-auto no-scrollbar">
          {navGroups.map((group) => (
            <div key={group.groupKey} className="space-y-0.5">
              {!collapsed && <GroupLabel>{t(group.groupKey)}</GroupLabel>}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const labelText = t(item.labelKey);

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 h-9 rounded-lg text-[13px] transition-colors group relative cursor-pointer',
                      isActive
                        ? 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold'
                        : 'border border-transparent text-zinc-600 dark:text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/50'
                    )}
                  >
                    {/* Tab marker: kotak kecil menancap di tepi kiri chip aktif */}
                    {isActive && (
                      <span className="absolute -left-[1.5px] top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-[1px] bg-blue-600 dark:bg-blue-400" />
                    )}
                    <Icon className={cn(
                      'w-4 h-4 shrink-0',
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'
                    )} />
                    
                    {!collapsed && (
                      <span className="truncate">{labelText}</span>
                    )}

                    {!collapsed && item.id.startsWith('hub_') && (
                      <ChevronRight className="ml-auto w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors" />
                    )}

                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2.5 py-1 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                        {labelText}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer / System Status — baris ledger mono */}
        <div className="p-3.5 border-t border-zinc-200 dark:border-zinc-800">
          {collapsed ? (
            <div className="flex justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          ) : (
            <div className="flex items-center justify-between text-[10px] font-mono font-medium uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                Local
              </span>
              <span>SQLite · Offline</span>
            </div>
          )}
        </div>
      </aside>

      {/* 2. MOBILE SLIDE-OVER DRAWER */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 transition-opacity"
            onClick={onCloseMobile} 
          />

          {/* Drawer Content */}
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 z-50 select-none pb-safe animate-in slide-in-from-left duration-250">
            {/* Header with Safe Area support for Android status bar */}
            <div className="flex items-center justify-between min-h-16 h-[calc(4rem+env(safe-area-inset-top,0px))] pt-[env(safe-area-inset-top,0px)] px-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-white dark:bg-zinc-800 p-0.5 border border-zinc-200 dark:border-zinc-700">
                  <img src={logoImg} alt="OmniLife Logo" className="w-full h-full object-contain rounded-md" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-extrabold text-[15px] tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
                    OmniLife
                  </span>
                  <span className="text-[9px] font-mono font-medium uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500 -mt-0.5">
                    Mandarin Learning OS
                  </span>
                </div>
              </div>

              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-800 active:scale-95 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 py-3 px-3 space-y-3 overflow-y-auto no-scrollbar">
              {navGroups.map((group) => (
                <div key={group.groupKey} className="space-y-0.5">
                  <GroupLabel>{t(group.groupKey)}</GroupLabel>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const labelText = t(item.labelKey);

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] transition-colors cursor-pointer active:scale-[0.98] relative',
                          isActive
                            ? 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold'
                            : 'border border-transparent text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-200/60 dark:hover:bg-zinc-800/50'
                        )}
                      >
                        {isActive && (
                          <span className="absolute -left-[1.5px] top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-[1px] bg-blue-600 dark:bg-blue-400" />
                        )}
                        <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-500')} />
                        <span className="truncate">{labelText}</span>
                        {item.id.startsWith('hub_') && (
                          <ChevronRight className="ml-auto w-4 h-4 text-zinc-300 dark:text-zinc-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Mobile Drawer Footer */}
            <div className="p-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom,0px))] border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-medium uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
                <Database className="w-3.5 h-3.5" /> SQLite Local
              </span>
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">v2.5.0</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
