import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface SettingsContextValue {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  fontSize: number;
  showLiveWpm: boolean;
  showLiveAccuracy: boolean;
  toggleTheme: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  setFontSize: (size: number) => void;
  setShowLiveWpm: (show: boolean) => void;
  setShowLiveAccuracy: (show: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('typerush-theme') === 'light' ? 'light' : 'dark'));
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fontSize, setFontSize] = useState(20);
  const [showLiveWpm, setShowLiveWpm] = useState(true);
  const [showLiveAccuracy, setShowLiveAccuracy] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('typerush-theme', theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      soundEnabled,
      fontSize,
      showLiveWpm,
      showLiveAccuracy,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
      setSoundEnabled,
      setFontSize,
      setShowLiveWpm,
      setShowLiveAccuracy,
    }),
    [fontSize, showLiveAccuracy, showLiveWpm, soundEnabled, theme],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used inside SettingsProvider');
  return context;
};
