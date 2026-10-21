import React, { useState, useEffect } from 'react';
import {
  isGatekeeperUnlocked,
  onGatekeeperStateChange,
} from '@/services/auth/gatekeeperService';
import { GatekeeperScreen } from './GatekeeperScreen';

interface GatekeeperGuardProps {
  children: React.ReactNode;
}

export const GatekeeperGuard: React.FC<GatekeeperGuardProps> = ({ children }) => {
  const [unlocked, setUnlocked] = useState<boolean>(() => isGatekeeperUnlocked());

  useEffect(() => {
    const unsubscribe = onGatekeeperStateChange((newStatus) => {
      setUnlocked(newStatus);
    });
    return () => unsubscribe();
  }, []);

  if (!unlocked) {
    return <GatekeeperScreen onUnlocked={() => setUnlocked(true)} />;
  }

  return <>{children}</>;
};
