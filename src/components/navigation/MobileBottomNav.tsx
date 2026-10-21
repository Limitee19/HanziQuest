import {
  LayoutDashboard,
  Languages,
  Bot,
  Settings as SettingsIcon,
  type LucideIcon,
} from 'lucide-react';
import type { NavTab } from '@/types';

interface MobileBottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMore?: () => void;
}

export function MobileBottomNav({ activeTab, onSelectTab }: MobileBottomNavProps) {
  const quickTabs: { id: NavTab; label: string; icon: LucideIcon }[] = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'chinese_learning', label: 'Mandarin', icon: Languages },
    { id: 'ai_assistant', label: 'Asisten AI', icon: Bot },
    { id: 'settings', label: 'Pengaturan', icon: SettingsIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-1 pt-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom,0px))] grid grid-cols-4 items-center select-none transition-colors">
      {quickTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              onSelectTab(tab.id);
            }}
            className="relative flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 w-full min-w-0"
          >
            {/* Active Topline Indicator — V3: kotak tegas, tanpa glow blur */}
            {isActive && (
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-7 h-[3px] rounded-[1px] bg-blue-600 dark:bg-blue-400" />
            )}

            <div
              className={`p-1 rounded-xl transition-all duration-200 flex items-center justify-center ${
                isActive
                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? 'scale-110 text-blue-600 dark:text-blue-400' : ''
                } transition-transform duration-200`}
              />
            </div>
            <span
              className={`text-[10px] sm:text-[10.5px] mt-0.5 tracking-tight truncate max-w-full text-center block ${
                isActive
                  ? 'font-display text-blue-600 dark:text-blue-400 font-bold'
                  : 'font-semibold text-zinc-500 dark:text-zinc-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
