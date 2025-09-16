'use client';

import { useEffect, useState } from 'react';
import { IgConnectButton } from '../components/ig-connect';
import IgMediaGrid from '../components/media/mdia';

interface AuthGateProps {
  limit?: number;
}

export const AuthGate = ({ limit = 24 }: AuthGateProps) => {
  const [igUserId, setIgUserId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const id = window.localStorage.getItem('igUserId');
    setIgUserId(id);
  }, []);

  if (!isHydrated) {
    return (
      <div className="w-full max-w-6xl">
        <div className="h-10 w-40 rounded-md bg-white/10 animate-pulse mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square w-full rounded-md bg-white/10 animate-pulse" />
              <div className="h-3 w-2/3 rounded bg-white/10 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return igUserId ? <IgMediaGrid limit={limit} /> : <IgConnectButton />;
};

export default AuthGate;