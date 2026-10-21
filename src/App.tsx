import { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import type { NavTab } from '@/types';
import { DbProvider, useDb } from '@/context/DbContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { AiAssistantPage } from '@/features/ai/AiAssistantPage';
import { ChineseLearningPage } from '@/features/chinese/ChineseLearningPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { DrillPage } from '@/features/quest/DrillPage';
import { LeechPage } from '@/features/quest/LeechPage';
import { GardenPage } from '@/features/quest/GardenPage';
import { SessionPage } from '@/features/course/SessionPage';
import { VocabularyVaultPage } from '@/features/vocab/VocabularyVaultPage';
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt';
import { AppLockScreenModal } from '@/components/security/AppLockScreenModal';
import { GatekeeperGuard } from '@/components/security/GatekeeperGuard';
import { ToastProvider } from '@/components/ui/Toast';
import {
  AlertTriangle,
  Database,
} from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [sessionLevel, setSessionLevel] = useState<number>(1);
  const [vocabTarget, setVocabTarget] = useState<{ query?: string; wordId?: string } | null>(null);
  const { isInitialized } = useDb();

  // Muat manifest aset Mandarin (data goresan resmi + audio offline) di startup.
  useEffect(() => {
    import('@/services/chinese/hanziAssets')
      .then((m) => m.ensureHanziAssets())
      .catch(() => {}); // gagal → fitur goresan/audio resmi fallback, app tetap jalan
  }, []);

  if (!isInitialized) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-[#090D16] text-[#0F172A] dark:text-[#F8FAFC] gap-5 select-none font-sans p-6">
        <div className="chop shadow-2xl transition-transform hover:scale-105" style={{ width: 68, height: 68, fontSize: 38, boxShadow: '0 12px 32px rgba(225, 29, 72, 0.45)' }}>
          字
        </div>
        <div className="flex items-center gap-2.5 text-sm font-bold text-zinc-500 dark:text-zinc-400">
          <Database className="w-4 h-4 animate-spin text-[#E11D48]" />
          <span>Menyiapkan petualangan aksara…</span>
        </div>
      </div>
    );
  }

  const handleStartSession = (lvl = 1) => {
    setSessionLevel(lvl);
    setActiveTab('session');
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={setActiveTab} />;
      case 'drill':
        return <DrillPage onBackToMap={() => setActiveTab('dashboard')} />;
      case 'leech':
        return (
          <LeechPage
            onBackToMap={() => setActiveTab('dashboard')}
            onStartSession={handleStartSession}
          />
        );
      case 'garden':
        return (
          <GardenPage
            onBackToMap={() => setActiveTab('dashboard')}
            onStartSession={handleStartSession}
          />
        );
      case 'vocab':
        return (
          <VocabularyVaultPage
            initialQuery={vocabTarget?.query}
            initialWordId={vocabTarget?.wordId}
          />
        );
      case 'session':
        return (
          <SessionPage
            initialLevel={sessionLevel}
            onBackToMap={() => setActiveTab('dashboard')}
          />
        );
      case 'chinese_learning':
        return <ChineseLearningPage />;
      case 'ai_assistant':
        return <AiAssistantPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setActiveTab} />;
    }
  };

  const handleNavigateTarget = (tab: NavTab, entityId?: string) => {
    if (tab === 'vocab' && entityId) {
      setVocabTarget({ wordId: entityId });
    } else {
      setVocabTarget(null);
    }
    setActiveTab(tab);
  };

  return (
    <>
      <MainLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNavigateTarget={handleNavigateTarget}
      >
        {renderActivePage()}
      </MainLayout>

      <PWAInstallPrompt />
      <AppLockScreenModal />
    </>
  );
}


interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by GlobalErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-6 text-center space-y-4 font-sans">
          <AlertTriangle className="w-8 h-8 text-rose-400" />
          <h2 className="text-xl font-bold">Terjadi Kesalahan Aplikasi</h2>
          <p className="text-xs text-zinc-400 max-w-md">
            {this.state.error?.message || 'Aplikasi mengalami kesalahan sistem yang tidak terduga.'}
          </p>
          <p className="text-xs text-zinc-500 max-w-md">Muat ulang aplikasi untuk kembali ke keadaan normal.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer"
          >
            Muat Ulang Aplikasi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <ToastProvider>
        <GatekeeperGuard>
          <DbProvider>
            <AppContent />
          </DbProvider>
        </GatekeeperGuard>
      </ToastProvider>
    </GlobalErrorBoundary>
  );
}
