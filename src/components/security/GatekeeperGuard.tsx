import React, { useState, useEffect } from 'react';
import { isAuthenticated, onAuthStateChange } from '@/services/auth/classAuthService';
import { ClassLoginPage } from '@/components/auth/ClassLoginPage';

interface GatekeeperGuardProps {
  children: React.ReactNode;
}

export const GatekeeperGuard: React.FC<GatekeeperGuardProps> = ({ children }) => {
  const [authed, setAuthed] = useState<boolean>(() => isAuthenticated());

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setAuthed(user !== null);
    });
    return () => unsubscribe();
  }, []);

  if (!authed) {
    return <ClassLoginPage onLoginSuccess={() => setAuthed(true)} />;
  }

  return <>{children}</>;
};
