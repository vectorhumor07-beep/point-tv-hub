import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface PiPState {
  active: boolean;
  streamUrl: string;
  title: string;
  subtitle: string;
  contentType: string;
  contentId: string;
}

interface PiPContextType {
  pip: PiPState;
  openPiP: (data: Omit<PiPState, 'active'>) => void;
  closePiP: () => void;
}

const PiPContext = createContext<PiPContextType | null>(null);

export const usePiP = () => {
  const ctx = useContext(PiPContext);
  if (!ctx) throw new Error('usePiP must be used within PiPProvider');
  return ctx;
};

export const PiPProvider = ({ children }: { children: ReactNode }) => {
  const [pip, setPip] = useState<PiPState>({
    active: false, streamUrl: '', title: '', subtitle: '', contentType: '', contentId: '',
  });

  const openPiP = useCallback((data: Omit<PiPState, 'active'>) => {
    setPip({ ...data, active: true });
  }, []);

  const closePiP = useCallback(() => {
    setPip(prev => ({ ...prev, active: false }));
  }, []);

  return (
    <PiPContext.Provider value={{ pip, openPiP, closePiP }}>
      {children}
    </PiPContext.Provider>
  );
};
