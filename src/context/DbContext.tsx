import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeDatabase } from '@/db/init';
import { registerSyncHook } from '@/db/client';
import { autoSyncRecordToSupabase, initAutoSyncEngine } from '@/services/sync/syncService';
import { syncAppLockFromDb } from '@/services/mobile/appLockService';
import { repairAnkiCardMedia } from '@/services/chinese/ankiMedia';
import { repairDeckTranslations } from '@/services/chinese/ankiTranslationRepair';

interface DbContextType {
  isInitialized: boolean;
  appStartDate: string | null;
  error: string | null;
}

const DbContext = createContext<DbContextType>({
  isInitialized: false,
  appStartDate: null,
  error: null,
});

export const DbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [appStartDate, setAppStartDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Timeout safety fallback: Force initialized after 3 seconds if DB init hangs
    const timeoutTimer = setTimeout(() => {
      if (isMounted && !isInitialized) {
        console.warn('Database initialization timeout reached. Forcing fallback initialization.');
        setIsInitialized(true);
      }
    }, 3000);
    
    async function setupDb() {
      try {
        const { appStartDate: startDate } = await initializeDatabase();
        
        // Register transparent mutation hook for all 52 tables
        registerSyncHook(autoSyncRecordToSupabase);

        // Sync and restore PIN code from SQLite app_metadata
        await syncAppLockFromDb();

        // Start Auto-Sync Engine (background heartbeat, online reconnect handler, fresh install auto-pull)
        initAutoSyncEngine();

        if (isMounted) {
          setAppStartDate(startDate);
          setIsInitialized(true);
        }

        // One-time legacy repair: tokenize Anki card content & rebuild audio_urls
        // (runs in background AFTER the UI is ready; idempotent via app_metadata marker)
        repairAnkiCardMedia().catch((e) => console.warn('Anki card media repair failed:', e));

        // One-time translation repair: arti campur Indonesia–Inggris di deck HSK
        // dipetakan ulang EKSAK dari field notes asli (idempoten via marker)
        repairDeckTranslations().catch((e) => console.warn('Translation repair failed:', e));
      } catch (err: any) {
        console.error('Failed to initialize local database:', err);
        if (isMounted) {
          setError(err?.message || 'Database initialization error');
          setIsInitialized(true); // Proceed with fallback state
        }
      } finally {
        clearTimeout(timeoutTimer);
      }
    }

    setupDb();

    return () => {
      isMounted = false;
      clearTimeout(timeoutTimer);
    };
  }, []);

  return (
    <DbContext.Provider value={{ isInitialized, appStartDate, error }}>
      {children}
    </DbContext.Provider>
  );
};

export function useDb() {
  return useContext(DbContext);
}
